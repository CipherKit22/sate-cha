-- SateCha Cybersecurity Platform - Database Schema
-- Fresh, error-free version created from scratch
-- Run this first to create all tables, types, and indexes

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom Types
CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'analyst');
CREATE TYPE public.threat_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.incident_status AS ENUM ('open', 'investigating', 'resolved', 'closed');
CREATE TYPE public.quiz_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE public.medal_type AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE public.language_preference AS ENUM ('english', 'burmese');

-- User Profiles Table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role public.user_role DEFAULT 'user',
    language_preference public.language_preference DEFAULT 'english',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Incidents Table
CREATE TABLE public.security_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    threat_level public.threat_level NOT NULL,
    status public.incident_status DEFAULT 'open',
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Conversations Table
CREATE TABLE public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(200),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_user_message BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Articles Table
CREATE TABLE public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    tags TEXT[],
    language public.language_preference DEFAULT 'english',
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Questions Table
CREATE TABLE public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of answer options
    correct_answer INTEGER NOT NULL, -- Index of correct option
    difficulty public.quiz_difficulty DEFAULT 'medium',
    language public.language_preference DEFAULT 'english',
    category VARCHAR(100),
    explanation TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Attempts Table
CREATE TABLE public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    difficulty public.quiz_difficulty NOT NULL,
    language public.language_preference NOT NULL,
    medal_earned public.medal_type,
    questions_answered JSONB DEFAULT '[]', -- Array of question IDs and answers
    time_taken INTEGER, -- Time in seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings Table
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    theme VARCHAR(20) DEFAULT 'dark',
    language public.language_preference DEFAULT 'english',
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    privacy_settings JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

CREATE INDEX idx_security_incidents_created_by ON public.security_incidents(created_by);
CREATE INDEX idx_security_incidents_assigned_to ON public.security_incidents(assigned_to);
CREATE INDEX idx_security_incidents_status ON public.security_incidents(status);
CREATE INDEX idx_security_incidents_threat_level ON public.security_incidents(threat_level);

CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);

CREATE INDEX idx_knowledge_articles_created_by ON public.knowledge_articles(created_by);
CREATE INDEX idx_knowledge_articles_language ON public.knowledge_articles(language);
CREATE INDEX idx_knowledge_articles_published ON public.knowledge_articles(is_published);

CREATE INDEX idx_quiz_questions_difficulty ON public.quiz_questions(difficulty);
CREATE INDEX idx_quiz_questions_language ON public.quiz_questions(language);
CREATE INDEX idx_quiz_questions_active ON public.quiz_questions(is_active);

CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_difficulty ON public.quiz_attempts(difficulty);

CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Comments for Documentation
COMMENT ON TABLE public.user_profiles IS 'Extended user profile information linked to Supabase auth.users';
COMMENT ON TABLE public.security_incidents IS 'Security incidents and threats reported in the platform';
COMMENT ON TABLE public.chat_conversations IS 'AI chatbot conversation sessions';
COMMENT ON TABLE public.chat_messages IS 'Individual messages within chat conversations';
COMMENT ON TABLE public.knowledge_articles IS 'Cybersecurity knowledge base articles';
COMMENT ON TABLE public.quiz_questions IS 'Quiz questions for cybersecurity training';
COMMENT ON TABLE public.quiz_attempts IS 'User quiz attempt records with scores and medals';
COMMENT ON TABLE public.user_settings IS 'User preferences and application settings';
COMMENT ON TABLE public.audit_logs IS 'System audit trail for security and compliance';
