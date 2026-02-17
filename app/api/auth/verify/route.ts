import { NextResponse } from 'next/server';
import { users, verifyTokens } from '../register/route';

export const dynamic = 'force-dynamic'; // Prevent static generation

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find email associated with token
    const email = verifyTokens.get(token);
    
    if (!email) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Get user
    const user = users.get(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mark user as verified
    user.verified = true;
    user.verifyToken = undefined;
    users.set(email, user);
    
    // Remove token
    verifyTokens.delete(token);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      email
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}