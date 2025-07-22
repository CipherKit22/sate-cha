-- SateCha Cybersecurity Platform - Row Level Security Policies
-- Fresh, error-free version created from scratch
-- Run this after 01_schema.sql to enable RLS and create policies

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Security Incidents Policies
CREATE POLICY "Users can view own incidents" ON public.security_incidents
    FOR SELECT USING (
        created_by IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        ) OR
        assigned_to IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create incidents" ON public.security_incidents
    FOR INSERT WITH CHECK (
        created_by IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update assigned incidents" ON public.security_incidents
    FOR UPDATE USING (
        assigned_to IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all incidents" ON public.security_incidents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'analyst')
        )
    );

-- Chat Conversations Policies
CREATE POLICY "Users can view own conversations" ON public.chat_conversations
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create conversations" ON public.chat_conversations
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own conversations" ON public.chat_conversations
    FOR UPDATE USING (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

-- Chat Messages Policies
CREATE POLICY "Users can view own messages" ON public.chat_messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM public.chat_conversations 
            WHERE user_id IN (
                SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create messages" ON public.chat_messages
    FOR INSERT WITH CHECK (
        conversation_id IN (
            SELECT id FROM public.chat_conversations 
            WHERE user_id IN (
                SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
            )
        )
    );

-- Knowledge Articles Policies
CREATE POLICY "Users can view published articles" ON public.knowledge_articles
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view own articles" ON public.knowledge_articles
    FOR SELECT USING (
        created_by IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all articles" ON public.knowledge_articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'analyst')
        )
    );

-- Quiz Questions Policies
CREATE POLICY "Users can view active questions" ON public.quiz_questions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'analyst')
        )
    );

-- Quiz Attempts Policies
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all attempts" ON public.quiz_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'analyst')
        )
    );

-- User Settings Policies
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR ALL USING (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

-- Audit Logs Policies
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('admin', 'analyst')
        )
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.security_incidents TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT SELECT ON public.knowledge_articles TO authenticated;
GRANT INSERT, UPDATE ON public.knowledge_articles TO authenticated;
GRANT SELECT ON public.quiz_questions TO authenticated;
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_settings TO authenticated;
GRANT INSERT ON public.audit_logs TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
