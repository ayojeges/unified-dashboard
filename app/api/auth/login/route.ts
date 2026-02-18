import { NextResponse } from 'next/server';
import { signInUser, signUpUser } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try to sign in first
    const { data: signInData, error: signInError } = await signInUser(email, password);
    
    if (!signInError && signInData.user) {
      // Successful login
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: signInData.user.id,
          email: signInData.user.email,
          name: signInData.user.user_metadata?.name || email.split('@')[0],
          verified: signInData.user.email_confirmed_at ? true : false
        }
      });
    }

    // If login failed with "Invalid login credentials", try to create account (demo mode)
    if (signInError?.message?.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await signUpUser(
        email, 
        password, 
        email.split('@')[0]
      );
      
      if (signUpError) {
        return NextResponse.json(
          { error: signUpError.message || 'Failed to create account' },
          { status: 400 }
        );
      }

      if (signUpData.user) {
        return NextResponse.json({
          success: true,
          message: 'Account created and logged in',
          user: {
            id: signUpData.user.id,
            email: signUpData.user.email,
            name: signUpData.user.user_metadata?.name || email.split('@')[0],
            verified: true // Auto-verify for demo
          }
        });
      }
    }

    // Other errors
    return NextResponse.json(
      { error: signInError?.message || 'Login failed' },
      { status: 401 }
    );

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
