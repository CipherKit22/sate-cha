-- SateCha Cybersecurity Platform - Triggers and Functions
-- Fresh, error-free version created from scratch
-- Run this after 02_rls_policies.sql to add automated functionality

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create user profile when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, username, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(50) DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        details,
        ip_address,
        user_agent
    ) VALUES (
        p_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_details,
        inet_client_addr(),
        'System'
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Silently handle errors to prevent blocking main operations
        NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate quiz medal based on score and difficulty
CREATE OR REPLACE FUNCTION public.calculate_quiz_medal(p_score INTEGER, p_difficulty TEXT)
RETURNS public.medal_type AS $$
BEGIN
    -- Medal thresholds based on difficulty
    CASE p_difficulty
        WHEN 'easy' THEN
            IF p_score >= 90 THEN RETURN 'gold';
            ELSIF p_score >= 80 THEN RETURN 'silver';
            ELSIF p_score >= 70 THEN RETURN 'bronze';
            ELSE RETURN NULL;
            END IF;
        WHEN 'medium' THEN
            IF p_score >= 85 THEN RETURN 'gold';
            ELSIF p_score >= 75 THEN RETURN 'silver';
            ELSIF p_score >= 65 THEN RETURN 'bronze';
            ELSE RETURN NULL;
            END IF;
        WHEN 'hard' THEN
            IF p_score >= 80 THEN RETURN 'platinum';
            ELSIF p_score >= 70 THEN RETURN 'gold';
            ELSIF p_score >= 60 THEN RETURN 'silver';
            ELSIF p_score >= 50 THEN RETURN 'bronze';
            ELSE RETURN NULL;
            END IF;
        ELSE
            RETURN NULL;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    user_profile_id UUID;
BEGIN
    -- Get user profile ID
    SELECT id INTO user_profile_id 
    FROM public.user_profiles 
    WHERE user_id = p_user_id;
    
    IF user_profile_id IS NULL THEN
        RETURN jsonb_build_object(
            'total_quiz_attempts', 0,
            'average_score', 0,
            'medals_earned', '{}',
            'incidents_created', 0,
            'incidents_resolved', 0,
            'chat_conversations', 0,
            'knowledge_articles', 0
        );
    END IF;
    
    -- Build statistics
    SELECT jsonb_build_object(
        'total_quiz_attempts', COALESCE(quiz_stats.total_attempts, 0),
        'average_score', COALESCE(quiz_stats.avg_score, 0),
        'medals_earned', COALESCE(quiz_stats.medals, '{}'),
        'incidents_created', COALESCE(incident_stats.created_count, 0),
        'incidents_resolved', COALESCE(incident_stats.resolved_count, 0),
        'chat_conversations', COALESCE(chat_stats.conversation_count, 0),
        'knowledge_articles', COALESCE(kb_stats.article_count, 0)
    ) INTO result
    FROM (
        SELECT 
            COUNT(*) as total_attempts,
            ROUND(AVG(score), 2) as avg_score,
            COALESCE(
                jsonb_object_agg(
                    medal_earned, 
                    medal_count
                ) FILTER (WHERE medal_earned IS NOT NULL), 
                '{}'::jsonb
            ) as medals
        FROM (
            SELECT 
                medal_earned,
                COUNT(*) as medal_count
            FROM public.quiz_attempts 
            WHERE user_id = user_profile_id AND medal_earned IS NOT NULL
            GROUP BY medal_earned
        ) medal_counts
        CROSS JOIN (
            SELECT COUNT(*) as total_attempts, AVG(score) as avg_score
            FROM public.quiz_attempts 
            WHERE user_id = user_profile_id
        ) totals
    ) quiz_stats
    FULL OUTER JOIN (
        SELECT 
            COUNT(*) FILTER (WHERE created_by = user_profile_id) as created_count,
            COUNT(*) FILTER (WHERE assigned_to = user_profile_id AND status = 'resolved') as resolved_count
        FROM public.security_incidents
    ) incident_stats ON true
    FULL OUTER JOIN (
        SELECT COUNT(*) as conversation_count
        FROM public.chat_conversations
        WHERE user_id = user_profile_id
    ) chat_stats ON true
    FULL OUTER JOIN (
        SELECT COUNT(*) as article_count
        FROM public.knowledge_articles
        WHERE created_by = user_profile_id
    ) kb_stats ON true;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for quiz attempts
CREATE OR REPLACE FUNCTION public.handle_quiz_attempt()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate and set medal
    NEW.medal_earned := public.calculate_quiz_medal(NEW.score, NEW.difficulty::text);
    
    -- Log the quiz attempt
    PERFORM public.log_user_activity(
        NEW.user_id,
        'quiz_completed',
        'quiz_attempt',
        NEW.id,
        jsonb_build_object(
            'score', NEW.score,
            'difficulty', NEW.difficulty,
            'medal', NEW.medal_earned
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for incident changes
CREATE OR REPLACE FUNCTION public.handle_incident_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Log incident creation
        PERFORM public.log_user_activity(
            NEW.created_by,
            'incident_created',
            'security_incident',
            NEW.id,
            jsonb_build_object(
                'title', NEW.title,
                'threat_level', NEW.threat_level
            )
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Log status changes
        IF OLD.status != NEW.status THEN
            PERFORM public.log_user_activity(
                COALESCE(NEW.assigned_to, NEW.created_by),
                'incident_status_changed',
                'security_incident',
                NEW.id,
                jsonb_build_object(
                    'old_status', OLD.status,
                    'new_status', NEW.status
                )
            );
        END IF;
        
        -- Set resolved_at timestamp
        IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
            NEW.resolved_at = NOW();
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create all triggers

-- Updated_at triggers for all tables
CREATE TRIGGER trigger_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_updated_at_security_incidents
    BEFORE UPDATE ON public.security_incidents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_updated_at_chat_conversations
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_updated_at_chat_messages
    BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_updated_at_knowledge_articles
    BEFORE UPDATE ON public.knowledge_articles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_updated_at_quiz_questions
    BEFORE UPDATE ON public.quiz_questions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_updated_at_quiz_attempts
    BEFORE UPDATE ON public.quiz_attempts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_updated_at_user_settings
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_updated_at_audit_logs
    BEFORE UPDATE ON public.audit_logs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- New user profile creation trigger
CREATE TRIGGER trigger_new_user_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Quiz attempt trigger
CREATE TRIGGER trigger_quiz_attempt
    BEFORE INSERT ON public.quiz_attempts
    FOR EACH ROW EXECUTE FUNCTION public.handle_quiz_attempt();

-- Incident changes trigger
CREATE TRIGGER trigger_incident_changes
    BEFORE INSERT OR UPDATE ON public.security_incidents
    FOR EACH ROW EXECUTE FUNCTION public.handle_incident_changes();
