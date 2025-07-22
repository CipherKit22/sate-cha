# SateCha Cybersecurity Platform - Database Setup

This folder contains all the SQL scripts needed to set up the SateCha platform database in Supabase. All scripts have been created fresh from scratch to ensure error-free execution.

## 🚀 Quick Setup

Run the scripts in this exact order:

1. **`00_reset_database.sql`** - ⚠️ **DANGER**: Completely wipes the database (use only for fresh start)
2. **`01_schema.sql`** - Creates all tables, types, and indexes
3. **`02_rls_policies.sql`** - Enables Row Level Security and creates access policies
4. **`03_triggers_functions.sql`** - Adds automated functions and triggers
5. **`04_sample_data.sql`** - Populates database with test data (optional)

## 📋 Script Details

### 00_reset_database.sql
- **Purpose**: Complete database reset
- **Warning**: Deletes ALL data, tables, functions, triggers, and policies
- **Use**: Only when starting completely fresh
- **Safety**: Review carefully before running

### 01_schema.sql
- **Purpose**: Core database structure
- **Creates**: Tables, custom types, indexes, and relationships
- **Tables**: user_profiles, security_incidents, chat_conversations, chat_messages, knowledge_articles, quiz_questions, quiz_attempts, user_settings, audit_logs
- **Features**: UUID primary keys, proper foreign key relationships, performance indexes

### 02_rls_policies.sql
- **Purpose**: Security and access control
- **Enables**: Row Level Security on all tables
- **Creates**: Policies ensuring users can only access their own data
- **Permissions**: Grants necessary table and sequence permissions
- **Roles**: Supports user, admin, and analyst roles with appropriate access levels

### 03_triggers_functions.sql
- **Purpose**: Automated database functionality
- **Functions**: 
  - `update_updated_at_column()` - Auto-updates timestamps
  - `handle_new_user()` - Creates profile when user signs up
  - `log_user_activity()` - Records user actions for audit
  - `calculate_quiz_medal()` - Awards medals based on quiz performance
  - `get_user_stats()` - Retrieves user statistics
  - `handle_quiz_attempt()` - Processes quiz submissions
  - `handle_incident_changes()` - Tracks security incident updates
- **Triggers**: Automatically execute functions on data changes

### 04_sample_data.sql
- **Purpose**: Test and development data
- **Includes**: 
  - Quiz questions in English and Burmese
  - Knowledge base articles
  - Sample security incidents
- **Languages**: Supports both English and Burmese content
- **Categories**: Covers various cybersecurity topics

## 🔐 Security Features

### Row Level Security (RLS)
- **User Isolation**: Users can only access their own data
- **Role-Based Access**: Admins and analysts have elevated permissions
- **Automatic Enforcement**: Policies automatically applied to all queries

### Audit Logging
- **Activity Tracking**: All user actions are logged
- **Security Monitoring**: Failed attempts and suspicious activity recorded
- **Compliance**: Supports regulatory requirements

### Data Protection
- **Encrypted Storage**: Sensitive data properly protected
- **Access Controls**: Multiple layers of security
- **Privacy Compliance**: GDPR and privacy-friendly design

## 🎯 Key Features

### Multi-Language Support
- **English**: Full platform support
- **Burmese**: Complete localization including quiz questions and articles
- **Extensible**: Easy to add more languages

### Quiz System
- **Difficulty Levels**: Easy, Medium, Hard
- **Medal System**: Bronze, Silver, Gold, Platinum based on performance
- **Progress Tracking**: Detailed statistics and achievements

### Security Incident Management
- **Threat Levels**: Low, Medium, High, Critical
- **Status Tracking**: Open, Investigating, Resolved, Closed
- **Assignment System**: Incidents can be assigned to security analysts

### Knowledge Base
- **Article Management**: Create and publish cybersecurity articles
- **Categorization**: Organized by topics and tags
- **Multi-Language**: Articles available in multiple languages

## 🛠️ Usage Examples

### Creating a New User
```sql
-- User signup automatically creates profile via trigger
-- No manual intervention needed
```

### Recording Quiz Attempt
```sql
INSERT INTO quiz_attempts (user_id, score, difficulty, language)
VALUES (user_profile_id, 85, 'medium', 'english');
-- Medal automatically calculated and activity logged
```

### Getting User Statistics
```sql
SELECT public.get_user_stats(user_profile_id);
-- Returns comprehensive user statistics as JSONB
```

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   - Ensure you're running scripts as database owner
   - Check RLS policies are properly configured

2. **Function Errors**
   - Verify all dependencies are installed
   - Check function parameter types match exactly

3. **Trigger Not Firing**
   - Confirm triggers are created after tables
   - Verify trigger functions exist and are valid

### Verification Queries

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables WHERE schemaname = 'public';

-- List all functions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' ORDER BY routine_name;
```

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify scripts were run in correct order
3. Review Supabase logs for detailed error messages
4. Ensure your Supabase project has sufficient permissions

## 🎉 Success Verification

After running all scripts successfully, you should have:
- ✅ All tables created with proper relationships
- ✅ RLS policies protecting user data
- ✅ Automated triggers and functions working
- ✅ Sample data for testing (if 04_sample_data.sql was run)
- ✅ Multi-language support enabled
- ✅ Audit logging active

Your SateCha platform database is now ready for production use!
