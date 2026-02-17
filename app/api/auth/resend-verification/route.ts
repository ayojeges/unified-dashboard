import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { users } from '../register/route';

export const dynamic = 'force-dynamic'; // Prevent static generation

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = users.get(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verifyToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Update user with new token
    user.verifyToken = verifyToken;
    users.set(email, user);

    // Send verification email via Resend
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://unified-dashboard-mauve.vercel.app'}/auth/verify?token=${verifyToken}`;
    
    let emailSent = false;
    let emailError = null;
    
    try {
      // Use Resend's default domain for testing if custom domain not verified
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Blueprint Creations <onboarding@resend.dev>';
      
      const result = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Verify your email - Blueprint Creations Dashboard',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #64FFDA, #00D4FF); color: #0A192F; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #0A192F; color: #64FFDA; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Verify Your Email</h1>
              </div>
              <div class="content">
                <p>Hi ${user.name},</p>
                <p>We received a request to resend your verification email. Please verify your email address to access your dashboard.</p>
                <p style="text-align: center;">
                  <a href="${verifyUrl}" class="button">Verify Email Address</a>
                </p>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #0A192F; font-size: 12px;">${verifyUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't request this email, you can safely ignore it.</p>
              </div>
              <div class="footer">
                <p>© 2026 Blueprint Creations LLC. All rights reserved.</p>
                <p>1827 Richmond PKWY, STE 102, Richmond, TX 77469</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
      
      console.log('Resend verification email sent successfully:', result);
      emailSent = true;
    } catch (err: any) {
      console.error('Failed to send verification email:', err);
      emailError = err.message || 'Email service error';
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? 'Verification email sent! Please check your inbox.'
        : 'Failed to send verification email. Please try again later.',
      emailSent,
      ...(emailError && { emailWarning: emailError })
    });

  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}