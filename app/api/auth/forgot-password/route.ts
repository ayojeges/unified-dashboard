import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory store for reset tokens (use database in production)
const resetTokens: Map<string, { email: string; expires: number }> = new Map();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15) +
                       Date.now().toString(36);
    
    // Store token with 1 hour expiry
    resetTokens.set(resetToken, {
      email,
      expires: Date.now() + 3600000 // 1 hour
    });

    // Send password reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://unified-dashboard-mauve.vercel.app'}/auth/reset-password?token=${resetToken}`;

    try {
      await resend.emails.send({
        from: 'Unified Dashboard <noreply@cdlschoolsusa.com>',
        to: email,
        subject: 'Reset your password - Unified Dashboard',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
              .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hi,</p>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                <p style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </p>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #ef4444;">${resetUrl}</p>
                <div class="warning">
                  <strong>⚠️ Important:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
                </div>
              </div>
              <div class="footer">
                <p>© 2024 Unified Dashboard. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      return NextResponse.json({
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
      });

    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    );
  }
}

export { resetTokens };
