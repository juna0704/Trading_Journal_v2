import nodemailer from "nodemailer";
import { logger, env } from "../config";
import { EmailOptions } from "../types/auth.types";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure based on environment
    if (env.NODE_ENV === "production") {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      // Deployment
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${env.APP_NAME}" <${env.SMTP_FROM}`,
        to,
        subject,
        html,
      });

      logger.info("Email sent", { messageId: info.messageId, to, subject });

      // Log preview URL in development
      if (env.NODE_ENV !== "production") {
        logger.info("Preview URL: " + nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      logger.error("Failed to send email", { error, to, subject });
      throw error;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

    const html = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <style>
                body{font-family: Arial, sans-serif; line-height:1.6; color:#333;}
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { margin-top: 40px; font-size: 12px; color: #666; }
            </style>
        <head>
        <body>
          <div class="container">
            <h1>Verify Your Email Address</h1>
            <p>Thank you for registering with ${env.APP_NAME}!</p>
            <p>Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
    </html>`;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
            .header { background-color: #4F46E5; padding: 20px; text-align: center; border-radius: 6px 6px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { padding: 30px 20px; }
            .button { display: inline-block; padding: 14px 28px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .button:hover { background-color: #4338CA; }
            .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
            .warning p { margin: 0; color: #92400E; }
            .link-box { background-color: #F3F4F6; padding: 15px; border-radius: 6px; word-break: break-all; margin: 20px 0; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #666; text-align: center; }
            .security-tips { background-color: #EFF6FF; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .security-tips h3 { margin-top: 0; color: #1E40AF; font-size: 16px; }
            .security-tips ul { margin: 10px 0; padding-left: 20px; }
            .security-tips li { margin: 5px 0; color: #1E3A8A; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset the password for your ${env.APP_NAME} account.</p>
              <p>Click the button below to choose a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="link-box">
                <code>${resetUrl}</code>
              </div>
              
              <div class="warning">
                <p><strong>⏱️ This link will expire in 1 hour</strong></p>
              </div>
              
              <div class="security-tips">
                <h3>Security Tips:</h3>
                <ul>
                  <li>Never share your password with anyone</li>
                  <li>Use a unique password for your ${env.APP_NAME} account</li>
                  <li>Choose a password with at least 8 characters</li>
                  <li>Include uppercase, lowercase, and numbers</li>
                </ul>
              </div>
              
              <p><strong>Didn't request this?</strong></p>
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <p>For security reasons, this reset link can only be used once.</p>
            </div>
            
            <div class="footer">
              <p>This email was sent from ${env.APP_NAME}</p>
              <p>© ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Reset Your ${env.APP_NAME} Password`,
      html,
    });
  }

  /**
   * Send account approval notification to user
   */
  async sendAccountApprovedEmail(email: string): Promise<void> {
    const loginUrl = `${env.FRONTEND_URL}/login`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
            .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .header .icon { font-size: 48px; margin-bottom: 10px; }
            .content { padding: 30px 20px; }
            .success-box { background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .success-box p { margin: 0; color: #065F46; font-weight: 500; }
            .button { display: inline-block; padding: 14px 32px; background-color: #10B981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; transition: background-color 0.3s; }
            .button:hover { background-color: #059669; }
            .features { background-color: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .features h3 { margin-top: 0; color: #1F2937; font-size: 18px; }
            .features ul { margin: 10px 0; padding-left: 20px; }
            .features li { margin: 8px 0; color: #4B5563; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">🎉</div>
              <h1>Account Approved!</h1>
            </div>
            <div class="content">
              <p>Great news!</p>
              
              <div class="success-box">
                <p>✅ Your ${env.APP_NAME} account has been approved and activated!</p>
              </div>
              
              <p>You can now access all features and start using ${env.APP_NAME}.</p>
              
              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to Your Account</a>
              </div>
              
              <div class="features">
                <h3>What's Next?</h3>
                <ul>
                  <li>Log in to your account using your credentials</li>
                  <li>Complete your profile information</li>
                  <li>Explore all available features</li>
                  <li>Start tracking your trades and portfolio</li>
                </ul>
              </div>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              
              <p>Welcome aboard!</p>
              <p><strong>The ${env.APP_NAME} Team</strong></p>
            </div>
            
            <div class="footer">
              <p>This email was sent from ${env.APP_NAME}</p>
              <p>© ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `🎉 Your ${env.APP_NAME} Account is Now Active!`,
      html,
    });
  }

  /**
   * Send registration pending notification to user
   */
  async sendRegistrationPendingEmail(email: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
            .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .header .icon { font-size: 48px; margin-bottom: 10px; }
            .content { padding: 30px 20px; }
            .info-box { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .info-box p { margin: 0; color: #92400E; }
            .timeline { background-color: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .timeline h3 { margin-top: 0; color: #1F2937; font-size: 18px; }
            .timeline-item { display: flex; align-items: start; margin: 15px 0; }
            .timeline-icon { background-color: #10B981; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; font-weight: bold; font-size: 12px; }
            .timeline-content { flex: 1; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">⏳</div>
              <h1>Registration Received!</h1>
            </div>
            <div class="content">
              <p>Thank you for registering with ${env.APP_NAME}!</p>
              
              <div class="info-box">
                <p><strong>⏱️ Your account is pending approval</strong></p>
              </div>
              
              <p>We've received your registration request. Our team will review your application and activate your account shortly.</p>
              
              <div class="timeline">
                <h3>What Happens Next:</h3>
                <div class="timeline-item">
                  <div class="timeline-icon">✓</div>
                  <div class="timeline-content">
                    <strong>Registration Complete</strong>
                    <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">You've successfully submitted your registration</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-icon">2</div>
                  <div class="timeline-content">
                    <strong>Admin Review</strong>
                    <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Our team will review your application</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-icon">3</div>
                  <div class="timeline-content">
                    <strong>Account Activation</strong>
                    <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">You'll receive an email when your account is approved</p>
                  </div>
                </div>
              </div>
              
              <p><strong>Estimated approval time:</strong> Usually within 24-48 hours</p>
              
              <p>You'll receive another email once your account has been approved and you can start using ${env.APP_NAME}.</p>
              
              <p>Thank you for your patience!</p>
              <p><strong>The ${env.APP_NAME} Team</strong></p>
            </div>
            
            <div class="footer">
              <p>This email was sent from ${env.APP_NAME}</p>
              <p>© ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Registration Received - ${env.APP_NAME}`,
      html,
    });
  }

  /**
   * Notify admin(s) about new registration
   */
  async notifyAdminNewRegistration(
    userEmail: string,
    userName: string,
    userId: string
  ): Promise<void> {
    const adminUrl = `${env.FRONTEND_URL}/admin/pending-users`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
            .header { background-color: #6366F1; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { padding: 30px 20px; }
            .user-info { background-color: #EEF2FF; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .user-info p { margin: 8px 0; color: #1E1B4B; }
            .button { display: inline-block; padding: 14px 28px; background-color: #6366F1; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New User Registration</h1>
            </div>
            <div class="content">
              <p>A new user has registered and is waiting for approval:</p>
              
              <div class="user-info">
                <p><strong>Name:</strong> ${userName || "Not provided"}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
                <p><strong>User ID:</strong> ${userId}</p>
                <p><strong>Registration Date:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p>Please review and approve this registration:</p>
              
              <div style="text-align: center;">
                <a href="${adminUrl}" class="button">Review Pending Users</a>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from ${env.APP_NAME}</p>
              <p>© ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Get admin email from environment or use a default
    const adminEmail = env.ADMIN_EMAIL || env.SMTP_FROM;

    await this.sendEmail({
      to: adminEmail,
      subject: `New User Registration - ${env.APP_NAME}`,
      html,
    });
  }

  /**
   * Send account deactivation notification
   */
  async sendAccountDeactivatedEmail(email: string): Promise<void> {
    const supportEmail = env.SUPPORT_EMAIL || env.SMTP_FROM;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 8px; }
            .header { background-color: #EF4444; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { padding: 30px 20px; }
            .warning-box { background-color: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .warning-box p { margin: 0; color: #991B1B; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Account Deactivated</h1>
            </div>
            <div class="content">
              <p>Your ${env.APP_NAME} account has been deactivated.</p>
              
              <div class="warning-box">
                <p><strong>You will no longer be able to access your account</strong></p>
              </div>
              
              <p>If you believe this was done in error or would like to discuss reactivating your account, please contact our support team.</p>
              
              <p><strong>Support Email:</strong> ${supportEmail}</p>
            </div>
            
            <div class="footer">
              <p>This email was sent from ${env.APP_NAME}</p>
              <p>© ${new Date().getFullYear()} ${env.APP_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: `Account Deactivated - ${env.APP_NAME}`,
      html,
    });
  }
}

export const emailService = new EmailService();
