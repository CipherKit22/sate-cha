-- Create Feedback Table and Related Functions
-- This script creates the feedback storage system for SateCha platform

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Overall satisfaction
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  satisfaction TEXT CHECK (satisfaction IN ('Extremely Satisfied', 'Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied')),
  
  -- Feature ratings
  ui_design INTEGER CHECK (ui_design >= 1 AND ui_design <= 5),
  performance INTEGER CHECK (performance >= 1 AND performance <= 5),
  features INTEGER CHECK (features >= 1 AND features <= 5),
  security INTEGER CHECK (security >= 1 AND security <= 5),
  
  -- User experience
  ease_of_use INTEGER CHECK (ease_of_use >= 1 AND ease_of_use <= 5),
  would_recommend TEXT,
  return_likelihood INTEGER CHECK (return_likelihood >= 1 AND return_likelihood <= 5),
  
  -- Detailed feedback
  favorite_feature TEXT,
  least_favorite TEXT,
  improvements TEXT,
  
  -- Creative responses
  platform_mood TEXT,
  superpower TEXT,
  one_word TEXT,
  
  -- Contact info (optional)
  feedback_name TEXT,
  feedback_email TEXT,
  
  -- Metadata
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'my')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_overall_rating ON feedback(overall_rating);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_language ON feedback(language);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own feedback
CREATE POLICY "Users can insert own feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own feedback
CREATE POLICY "Users can update own feedback" ON feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Admins can view all feedback
CREATE POLICY "Admins can view all feedback" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policy: Admins can update all feedback (for admin notes, status changes)
CREATE POLICY "Admins can update all feedback" ON feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policy: Admins can delete feedback
CREATE POLICY "Admins can delete feedback" ON feedback
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create view for feedback with user information
CREATE OR REPLACE VIEW feedback_with_user AS
SELECT 
  f.*,
  up.username,
  up.full_name,
  au.email as user_email
FROM feedback f
LEFT JOIN user_profiles up ON f.user_id = up.user_id
LEFT JOIN auth.users au ON f.user_id = au.id
WHERE f.status = 'active';

-- Function to get feedback statistics
CREATE OR REPLACE FUNCTION get_feedback_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_feedback', COUNT(*),
    'avg_overall_rating', ROUND(AVG(overall_rating), 2),
    'avg_ui_design', ROUND(AVG(ui_design), 2),
    'avg_performance', ROUND(AVG(performance), 2),
    'avg_features', ROUND(AVG(features), 2),
    'avg_security', ROUND(AVG(security), 2),
    'avg_ease_of_use', ROUND(AVG(ease_of_use), 2),
    'avg_return_likelihood', ROUND(AVG(return_likelihood), 2),
    'satisfaction_breakdown', (
      SELECT jsonb_object_agg(satisfaction, count)
      FROM (
        SELECT satisfaction, COUNT(*) as count
        FROM feedback
        WHERE status = 'active' AND satisfaction IS NOT NULL
        GROUP BY satisfaction
      ) s
    ),
    'rating_distribution', (
      SELECT jsonb_object_agg(rating, count)
      FROM (
        SELECT overall_rating as rating, COUNT(*) as count
        FROM feedback
        WHERE status = 'active' AND overall_rating IS NOT NULL
        GROUP BY overall_rating
        ORDER BY overall_rating
      ) r
    ),
    'recent_feedback_count', (
      SELECT COUNT(*)
      FROM feedback
      WHERE status = 'active' 
      AND created_at >= NOW() - INTERVAL '30 days'
    )
  ) INTO result
  FROM feedback
  WHERE status = 'active';
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get feedback by filters
CREATE OR REPLACE FUNCTION get_filtered_feedback(
  p_user_id UUID DEFAULT NULL,
  p_min_rating INTEGER DEFAULT NULL,
  p_max_rating INTEGER DEFAULT NULL,
  p_satisfaction TEXT DEFAULT NULL,
  p_language TEXT DEFAULT NULL,
  p_date_from TIMESTAMP DEFAULT NULL,
  p_date_to TIMESTAMP DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  username TEXT,
  full_name TEXT,
  user_email TEXT,
  overall_rating INTEGER,
  satisfaction TEXT,
  ui_design INTEGER,
  performance INTEGER,
  features INTEGER,
  security INTEGER,
  ease_of_use INTEGER,
  would_recommend TEXT,
  return_likelihood INTEGER,
  favorite_feature TEXT,
  least_favorite TEXT,
  improvements TEXT,
  platform_mood TEXT,
  superpower TEXT,
  one_word TEXT,
  feedback_name TEXT,
  feedback_email TEXT,
  language TEXT,
  status TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.user_id,
    f.username,
    f.full_name,
    f.user_email,
    f.overall_rating,
    f.satisfaction,
    f.ui_design,
    f.performance,
    f.features,
    f.security,
    f.ease_of_use,
    f.would_recommend,
    f.return_likelihood,
    f.favorite_feature,
    f.least_favorite,
    f.improvements,
    f.platform_mood,
    f.superpower,
    f.one_word,
    f.feedback_name,
    f.feedback_email,
    f.language,
    f.status,
    f.admin_notes,
    f.created_at,
    f.updated_at
  FROM feedback_with_user f
  WHERE 
    (p_user_id IS NULL OR f.user_id = p_user_id)
    AND (p_min_rating IS NULL OR f.overall_rating >= p_min_rating)
    AND (p_max_rating IS NULL OR f.overall_rating <= p_max_rating)
    AND (p_satisfaction IS NULL OR f.satisfaction = p_satisfaction)
    AND (p_language IS NULL OR f.language = p_language)
    AND (p_date_from IS NULL OR f.created_at >= p_date_from)
    AND (p_date_to IS NULL OR f.created_at <= p_date_to)
    AND f.status = 'active'
  ORDER BY f.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON feedback TO authenticated;
GRANT SELECT ON feedback_with_user TO authenticated;
GRANT EXECUTE ON FUNCTION get_feedback_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_filtered_feedback(UUID, INTEGER, INTEGER, TEXT, TEXT, TIMESTAMP, TIMESTAMP, INTEGER, INTEGER) TO authenticated;
