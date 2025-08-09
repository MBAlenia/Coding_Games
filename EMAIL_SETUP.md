# 📧 Email Configuration Guide

This guide explains how to configure email sending for assessment invitations.

## 🚀 Quick Setup

### 1. Gmail Configuration (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Update .env file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
COMPANY_NAME=Your Company Name
FRONTEND_URL=http://localhost:3000
```

### 2. Outlook/Hotmail Configuration

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
COMPANY_NAME=Your Company Name
FRONTEND_URL=http://localhost:3000
```

### 3. Custom SMTP Server

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
COMPANY_NAME=Your Company Name
FRONTEND_URL=http://localhost:3000
```

## 🔧 Testing Email Configuration

1. **Restart the backend service**:
```bash
docker-compose restart backend
```

2. **Check logs** for email service initialization:
```bash
docker-compose logs backend | grep "Email service"
```

3. **Send test invitation** through the web interface

## 📧 Email Features

### ✅ What's Included:

- **Professional HTML templates** with responsive design
- **Assessment details** (title, description, duration)
- **Secure invitation links** with expiration
- **Company branding** with customizable name
- **Plain text fallback** for all email clients
- **Automatic reminders** (can be implemented)

### 📋 Email Template Features:

- **Modern design** with gradients and icons
- **Mobile responsive** layout
- **Clear call-to-action** buttons
- **Assessment instructions** and guidelines
- **Expiration warnings** and important notes
- **Professional footer** with company information

## 🔐 Security Best Practices

1. **Use App Passwords** instead of main account passwords
2. **Enable 2FA** on email accounts
3. **Use environment variables** for credentials
4. **Never commit** email credentials to version control
5. **Rotate passwords** regularly

## 🚨 Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check username/password
   - Use App Password for Gmail
   - Enable "Less secure apps" if required

2. **"Connection timeout"**
   - Check SMTP host and port
   - Verify firewall settings
   - Try different ports (465 for SSL)

3. **"Email not received"**
   - Check spam/junk folders
   - Verify recipient email address
   - Check email service logs

### Debug Mode:

Add to .env for detailed logging:
```env
NODE_ENV=development
DEBUG=nodemailer*
```

## 📊 Email Analytics (Future Enhancement)

Potential features to add:
- Email delivery tracking
- Open rate monitoring
- Click-through analytics
- Bounce handling
- Unsubscribe management

## 🎯 Usage in Application

### Recruiter Workflow:

1. **Navigate** to "Send Invitations" from dashboard
2. **Select assessment** from dropdown
3. **Choose candidates** from list or add new ones
4. **Click "Send Invitations"** button
5. **Emails sent automatically** with tracking

### Candidate Experience:

1. **Receives professional email** with assessment details
2. **Clicks secure link** to access assessment
3. **Completes assessment** within time limit
4. **Results automatically** sent to recruiter

## 📝 Email Templates

The system includes two main templates:

### 1. Invitation Email
- Welcome message with candidate name
- Assessment details and requirements
- Clear instructions and guidelines
- Secure access link with expiration
- Professional branding

### 2. Reminder Email (Optional)
- Urgent reminder for pending assessments
- Time remaining notification
- Quick access to assessment
- Encouraging message

## 🔄 Email Service Architecture

```
Frontend (React)
    ↓
Backend API (/api/assessments/:id/invitations)
    ↓
InvitationController.createInvitation()
    ↓
EmailService.sendAssessmentInvitation()
    ↓
Nodemailer → SMTP Server → Recipient
```

## 🌟 Production Recommendations

1. **Use dedicated email service** (SendGrid, AWS SES, Mailgun)
2. **Implement email queues** for bulk sending
3. **Add retry logic** for failed sends
4. **Monitor delivery rates** and bounce handling
5. **Set up email authentication** (SPF, DKIM, DMARC)

---

**Ready to send professional assessment invitations! 🚀**
