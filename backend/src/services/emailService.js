const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Configure SMTP transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection
      if (process.env.SMTP_USER && process.env.SMTP_PASS && 
          process.env.SMTP_USER !== 'your-email@gmail.com') {
        await this.transporter.verify();
        console.log('📧 Email service initialized successfully');
      } else {
        console.log('⚠️ Email service not configured - using default credentials');
        console.log('   To enable emails: configure SMTP_USER and SMTP_PASS in .env');
      }
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
    }
  }

  async sendAssessmentInvitation({
    candidateEmail,
    candidateName,
    assessmentTitle,
    assessmentDescription,
    duration,
    invitationLink,
    recruiterName,
    expiresAt
  }) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const htmlTemplate = await this.getInvitationTemplate({
        candidateName,
        assessmentTitle,
        assessmentDescription,
        duration,
        invitationLink,
        recruiterName,
        expiresAt
      });

      const mailOptions = {
        from: `"${process.env.COMPANY_NAME || 'Coding Platform'}" <${process.env.SMTP_USER}>`,
        to: candidateEmail,
        subject: `Assessment Invitation: ${assessmentTitle}`,
        html: htmlTemplate,
        text: this.getPlainTextInvitation({
          candidateName,
          assessmentTitle,
          assessmentDescription,
          duration,
          invitationLink,
          recruiterName,
          expiresAt
        })
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Assessment invitation sent:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Invitation sent successfully'
      };
    } catch (error) {
      console.error('❌ Failed to send assessment invitation:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to send invitation'
      };
    }
  }

  async sendAssessmentReminder({
    candidateEmail,
    candidateName,
    assessmentTitle,
    invitationLink,
    timeRemaining
  }) {
    try {
      if (!this.transporter) {
        throw new Error('Email service not initialized');
      }

      const htmlTemplate = await this.getReminderTemplate({
        candidateName,
        assessmentTitle,
        invitationLink,
        timeRemaining
      });

      const mailOptions = {
        from: `"${process.env.COMPANY_NAME || 'Coding Platform'}" <${process.env.SMTP_USER}>`,
        to: candidateEmail,
        subject: `Reminder: ${assessmentTitle} - ${timeRemaining} remaining`,
        html: htmlTemplate
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Assessment reminder sent:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('❌ Failed to send assessment reminder:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getInvitationTemplate({
    candidateName,
    assessmentTitle,
    assessmentDescription,
    duration,
    invitationLink,
    recruiterName,
    expiresAt
  }) {
    const expirationDate = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assessment Invitation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .assessment-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 24px 0; }
        .assessment-title { font-size: 20px; font-weight: 600; color: #2d3748; margin-bottom: 12px; }
        .assessment-details { color: #4a5568; margin-bottom: 16px; }
        .detail-item { display: flex; align-items: center; margin-bottom: 8px; }
        .detail-icon { width: 16px; height: 16px; margin-right: 8px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; text-align: center; }
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); }
        .expiration { background: #fef5e7; border: 1px solid #f6ad55; border-radius: 6px; padding: 12px; margin: 20px 0; color: #744210; }
        .footer { background: #f7fafc; padding: 24px 30px; text-align: center; color: #718096; font-size: 14px; }
        .instructions { background: #e6fffa; border: 1px solid #38b2ac; border-radius: 6px; padding: 16px; margin: 20px 0; }
        .instructions h3 { color: #234e52; margin-top: 0; }
        .instructions ul { color: #2c7a7b; margin: 0; padding-left: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Assessment Invitation</h1>
            <p>You've been invited to take a coding assessment</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello <strong>${candidateName}</strong>,
            </div>
            
            <p>You have been invited by <strong>${recruiterName}</strong> to take a coding assessment. This is an opportunity to showcase your programming skills!</p>
            
            <div class="assessment-card">
                <div class="assessment-title">${assessmentTitle}</div>
                <div class="assessment-details">
                    ${assessmentDescription}
                </div>
                
                <div class="detail-item">
                    <span class="detail-icon">⏱️</span>
                    <span><strong>Duration:</strong> ${duration} minutes</span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">📅</span>
                    <span><strong>Expires:</strong> ${expirationDate}</span>
                </div>
            </div>
            
            <div class="instructions">
                <h3>📋 Instructions:</h3>
                <ul>
                    <li>Click the button below to start your assessment</li>
                    <li>You'll have ${duration} minutes to complete all questions</li>
                    <li>Make sure you have a stable internet connection</li>
                    <li>The assessment will auto-submit when time expires</li>
                    <li>You can save your progress and test your code</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="${invitationLink}" class="cta-button">
                    🎯 Start Assessment
                </a>
            </div>
            
            <div class="expiration">
                <strong>⚠️ Important:</strong> This invitation expires on ${expirationDate}. Please complete the assessment before this date.
            </div>
            
            <p>If you have any questions or technical issues, please contact the recruiter who sent you this invitation.</p>
            
            <p>Good luck! 🍀</p>
        </div>
        
        <div class="footer">
            <p>This invitation was sent by ${process.env.COMPANY_NAME || 'Coding Platform'}</p>
            <p>If you received this email by mistake, please ignore it.</p>
        </div>
    </div>
</body>
</html>
    `;
  }

  getPlainTextInvitation({
    candidateName,
    assessmentTitle,
    assessmentDescription,
    duration,
    invitationLink,
    recruiterName,
    expiresAt
  }) {
    const expirationDate = new Date(expiresAt).toLocaleDateString();
    
    return `
Assessment Invitation

Hello ${candidateName},

You have been invited by ${recruiterName} to take a coding assessment: "${assessmentTitle}"

Description: ${assessmentDescription}

Details:
- Duration: ${duration} minutes
- Expires: ${expirationDate}

To start your assessment, visit: ${invitationLink}

Instructions:
1. Click the link above to start your assessment
2. You'll have ${duration} minutes to complete all questions
3. Make sure you have a stable internet connection
4. The assessment will auto-submit when time expires

Good luck!

---
This invitation was sent by ${process.env.COMPANY_NAME || 'Coding Platform'}
    `;
  }

  async getReminderTemplate({
    candidateName,
    assessmentTitle,
    invitationLink,
    timeRemaining
  }) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assessment Reminder</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0; }
        .urgent { background: #fed7d7; border: 1px solid #fc8181; border-radius: 6px; padding: 16px; margin: 20px 0; color: #742a2a; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ Assessment Reminder</h1>
        </div>
        
        <div class="content">
            <p>Hello <strong>${candidateName}</strong>,</p>
            
            <div class="urgent">
                <strong>⚠️ Reminder:</strong> Your assessment "${assessmentTitle}" expires in <strong>${timeRemaining}</strong>!
            </div>
            
            <p>Don't miss your chance to showcase your skills. Complete your assessment now:</p>
            
            <div style="text-align: center;">
                <a href="${invitationLink}" class="cta-button">
                    🎯 Complete Assessment Now
                </a>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }
}

const emailService = new EmailService();

// Simplified function for development - logs email template to console
const sendInvitationEmail = async (emailData) => {
  const { to, candidateName, assessmentTitle, assessmentDescription, duration, invitationUrl, expiresAt } = emailData;
  
  // Create formatted email template for console logging
  const emailTemplate = `
================================================================================
📧 EMAIL INVITATION TEMPLATE (Development Mode)
================================================================================
TO: ${to}
FROM: noreply@coding-platform.com
SUBJECT: Assessment Invitation: ${assessmentTitle}
--------------------------------------------------------------------------------

Dear ${candidateName},

You have been invited to complete the following coding assessment:

📝 Assessment: ${assessmentTitle}
📋 Description: ${assessmentDescription}
⏱️  Duration: ${duration} minutes
📅 Expires: ${new Date(expiresAt).toLocaleDateString()} at ${new Date(expiresAt).toLocaleTimeString()}

To start your assessment, please click the link below:
${invitationUrl}

IMPORTANT INSTRUCTIONS:
• Ensure you have a stable internet connection
• Complete the assessment in one session (${duration} minutes)
• Your progress will be automatically saved
• The assessment will auto-submit when time expires

TECHNICAL REQUIREMENTS:
• Modern web browser (Chrome, Firefox, Safari, Edge)
• JavaScript enabled
• Stable internet connection

If you have any questions or technical issues, please contact your recruiter.

Good luck with your assessment!

Best regards,
The Coding Platform Team

--------------------------------------------------------------------------------
This is an automated message. Please do not reply to this email.
================================================================================
`;

  // Log the email template to console
  console.log('\n' + emailTemplate);
  
  // In production, this would send the actual email
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NODE_ENV === 'production') {
    try {
      return await emailService.sendAssessmentInvitation({
        candidateEmail: to,
        candidateName,
        assessmentTitle,
        assessmentDescription,
        duration,
        invitationLink: invitationUrl,
        recruiterName: 'Recruiter',
        expiresAt
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
  
  // Return success for development
  return {
    success: true,
    message: 'Email logged to console (development mode)',
    invitationUrl
  };
};

module.exports = emailService;
module.exports.sendInvitationEmail = sendInvitationEmail;
