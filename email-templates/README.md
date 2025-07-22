# SateCha Email Templates

This directory contains email templates for the SateCha Cybersecurity Platform.

## Templates

### 1. Signup Confirmation Email

**Files:**
- `signup-confirmation.html` - HTML version with modern styling
- `signup-confirmation.txt` - Plain text version for email clients that don't support HTML

**Purpose:**
Send to users after they register to confirm their email address.

**Template Variables (Supabase Format):**
- `{{ .Email }}` - User's email address (automatically provided by Supabase)
- `{{ .ConfirmationURL }}` - Email confirmation URL (automatically provided by Supabase)
- Static URLs can be hardcoded in the template:
  - Website URL, Support URL, Privacy Policy URL

**Supabase Integration:**
These templates are ready to use directly in Supabase Auth settings:
1. Go to Authentication > Settings > Email Templates
2. Select "Confirm signup" template
3. Replace the default template with either the HTML or plain text version
4. Supabase will automatically populate `{{ .Email }}` and `{{ .ConfirmationURL }}`

## Features

### HTML Template Features:
- **Responsive Design** - Works on desktop and mobile
- **Modern Styling** - Glassmorphism and gradient effects matching SateCha theme
- **Orbitron Font** - Consistent with platform branding
- **Animated Elements** - Subtle shimmer effects
- **Security-focused Design** - Professional cybersecurity aesthetic
- **Feature Preview** - Shows what users will get access to
- **Clear Call-to-Action** - Prominent confirmation button

### Text Template Features:
- **ASCII Art Styling** - Professional text formatting
- **Clear Structure** - Easy to read in any email client
- **All Essential Information** - Complete signup confirmation details
- **Fallback Support** - For email clients that don't support HTML

## Customization

To customize the templates:

1. **Colors**: Update CSS variables in the HTML template
2. **Branding**: Replace logo and company information
3. **Content**: Modify welcome messages and feature descriptions
4. **Links**: Update all URL placeholders with your actual URLs

## Integration

These templates are designed to work with:
- **Supabase Auth** - Email confirmation system
- **Custom Email Services** - SendGrid, Mailgun, etc.
- **SMTP Services** - Any standard email service

## Security Notes

- Confirmation links expire in 24 hours
- Templates include security warnings
- No sensitive information is included in templates
- All links should use HTTPS in production
