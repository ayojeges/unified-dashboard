import { NextResponse } from 'next/server';
import { signUpUser } from '@/lib/supabase';

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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Sign up with Supabase Auth (auto-confirmed, no email needed)
    const { data, error } = await signUpUser(email, password, name);
    
    if (error) {
      // Check for duplicate email
      if (error.message?.includes('already been registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please login instead.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: 400 }
      );
    }

    const user = data?.user;
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // User is auto-confirmed - they can login immediately
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      requiresVerification: false, // No email verification needed
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || name
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
