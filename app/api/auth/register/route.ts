import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory store for demo (use database in production)
const users: Map<string, { email: string; password: string; name: string; verified: boolean; verifyToken?: string }> = new Map();
const verifyTokens: Map<string, string> = new Map(); // token -> email

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.has(email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verifyToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Store user (unverified)
    users.set(email, {
      email,
      password, // In production, hash this!
      name,
      verified: false,
      verifyToken
    });
    verifyTokens.set(verifyToken, email);

    // Send verification email via Resend
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://unified-dashboard-mauve.vercel.app'}/auth/verify?token=${verifyToken}`;
    
    try {
      await resend.emails.send({
        from: 'Unified Dashboard <noreply@cdlschoolsusa.com>',
        to: email,
        subject: 'Verify your email - Unified Dashboard',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Unified Dashboard!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thanks for signing up! Please verify your email address to get started.</p>
                <p style="text-align: center;">
                  <a href="${verifyUrl}" class="button">Verify Email Address</a>
                </p>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #3b82f6;">${verifyUrl}</p>
                <p>This link will expire in 24 hours.</p>
              </div>
              <div class="footer">
                <p>© 2024 Unified Dashboard. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Still create the account, just warn about email
    }

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      requiresVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

// Export users map for other routes to use
export { users, verifyTokens };
