const nodemailer = require('nodemailer');
const crypto = require('crypto');

class InvitationEmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  generateInvitationToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  createInvitationEmailTemplate(candidateName, assessmentTitle, invitationUrl, companyName = 'TechCorp') {
    return {
      subject: `🚀 Coding Assessment Invitation - ${assessmentTitle}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Coding Assessment Invitation</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 15px;
              padding: 2px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .content {
              background: white;
              border-radius: 13px;
              padding: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              color: #2c3e50;
              margin-bottom: 20px;
              text-align: center;
            }
            .greeting {
              font-size: 18px;
              color: #34495e;
              margin-bottom: 20px;
            }
            .assessment-info {
              background: #f8f9fa;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 25px;
              font-weight: bold;
              font-size: 16px;
              text-align: center;
              margin: 20px 0;
              box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
              transition: transform 0.2s;
            }
            .cta-button:hover {
              transform: translateY(-2px);
            }
            .instructions {
              background: #e8f4fd;
              border: 1px solid #bee5eb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .instructions h3 {
              color: #0c5460;
              margin-top: 0;
            }
            .instructions ul {
              color: #155724;
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
            }
            .tech-specs {
              display: flex;
              justify-content: space-around;
              margin: 20px 0;
              text-align: center;
            }
            .spec-item {
              flex: 1;
              padding: 10px;
            }
            .spec-icon {
              font-size: 24px;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <div class="header">
                <div class="logo">💻 ${companyName}</div>
                <div class="title">Coding Assessment Invitation</div>
              </div>
              
              <div class="greeting">
                Hello <strong>${candidateName}</strong>,
              </div>
              
              <p>We're excited to invite you to take our technical coding assessment as part of our selection process. This is your opportunity to showcase your programming skills!</p>
              
              <div class="assessment-info">
                <h3>📋 Assessment Details</h3>
                <p><strong>Assessment:</strong> ${assessmentTitle}</p>
                <p><strong>Duration:</strong> 60 minutes</p>
                <p><strong>Language:</strong> SQL</p>
                <p><strong>Questions:</strong> Multiple progressive difficulty levels</p>
              </div>
              
              <div class="tech-specs">
                <div class="spec-item">
                  <div class="spec-icon">⏱️</div>
                  <div><strong>Timed</strong><br>60 minutes</div>
                </div>
                <div class="spec-item">
                  <div class="spec-icon">🔒</div>
                  <div><strong>Secure</strong><br>Anti-cheat enabled</div>
                </div>
                <div class="spec-item">
                  <div class="spec-icon">✅</div>
                  <div><strong>Real-time</strong><br>Instant feedback</div>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${invitationUrl}" class="cta-button">
                  🚀 Start Assessment Now
                </a>
              </div>
              
              <div class="instructions">
                <h3>📝 Instructions</h3>
                <ul>
                  <li><strong>Prepare your environment:</strong> Ensure stable internet connection</li>
                  <li><strong>Time management:</strong> You have 60 minutes to complete all questions</li>
                  <li><strong>Code editor:</strong> Built-in SQL editor with syntax highlighting</li>
                  <li><strong>Testing:</strong> Each question includes test cases for validation</li>
                  <li><strong>Navigation:</strong> You can move between questions and return to previous ones</li>
                  <li><strong>Auto-save:</strong> Your progress is automatically saved</li>
                </ul>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important Notes:</strong>
                <ul style="margin: 10px 0;">
                  <li>Copy/paste functionality is disabled during the assessment</li>
                  <li>The assessment must be completed in one session</li>
                  <li>Make sure to click "Submit" when finished</li>
                  <li>This invitation link is unique and expires after use</li>
                </ul>
              </div>
              
              <p>If you have any technical issues or questions, please don't hesitate to contact our support team.</p>
              
              <p>Good luck! We're looking forward to seeing your coding skills in action.</p>
              
              <div class="footer">
                <p>Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
                <p style="font-size: 12px; color: #999;">
                  This is an automated message. Please do not reply to this email.<br>
                  If you need assistance, contact us at support@${companyName.toLowerCase()}.com
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Coding Assessment Invitation - ${assessmentTitle}
        
        Hello ${candidateName},
        
        We're excited to invite you to take our technical coding assessment as part of our selection process.
        
        Assessment Details:
        - Assessment: ${assessmentTitle}
        - Duration: 60 minutes
        - Language: SQL
        - Questions: Multiple progressive difficulty levels
        
        Click here to start: ${invitationUrl}
        
        Instructions:
        - Ensure stable internet connection
        - You have 60 minutes to complete all questions
        - Built-in SQL editor with syntax highlighting
        - Each question includes test cases for validation
        - You can navigate between questions
        - Your progress is automatically saved
        
        Important Notes:
        - Copy/paste functionality is disabled during the assessment
        - The assessment must be completed in one session
        - Make sure to click "Submit" when finished
        - This invitation link is unique and expires after use
        
        Good luck!
        
        Best regards,
        ${companyName} Recruitment Team
      `
    };
  }

  async sendInvitationEmail(candidateEmail, candidateName, assessmentTitle, invitationUrl, companyName) {
    try {
      const emailTemplate = this.createInvitationEmailTemplate(
        candidateName, 
        assessmentTitle, 
        invitationUrl, 
        companyName
      );

      const mailOptions = {
        from: `"${companyName} Recruitment" <${process.env.SMTP_USER}>`,
        to: candidateEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Invitation email sent successfully:', {
        messageId: result.messageId,
        to: candidateEmail,
        subject: emailTemplate.subject
      });

      return {
        success: true,
        messageId: result.messageId,
        preview: nodemailer.getTestMessageUrl(result)
      };

    } catch (error) {
      console.error('❌ Failed to send invitation email:', error);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }
  }

  // Create invitation record in database
  async createInvitation(assessmentId, candidateEmail, candidateName) {
    const token = this.generateInvitationToken();
    const invitationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/take-assessment/${assessmentId}?token=${token}`;
    
    // This would typically insert into database
    const invitationData = {
      assessment_id: assessmentId,
      candidate_email: candidateEmail,
      candidate_name: candidateName,
      token: token,
      url: invitationUrl,
      status: 'sent',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      created_at: new Date()
    };

    console.log('📧 Invitation created:', invitationData);
    
    return invitationData;
  }
}

module.exports = new InvitationEmailService();
