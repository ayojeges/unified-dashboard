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
          verified: true
        }
      });
    }

    // If login failed with "Invalid login credentials", create new account
    if (signInError?.message?.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await signUpUser(
        email, 
        password, 
        email.split('@')[0]
      );
      
      if (signUpError) {
        // Check if user already exists
        if (signUpError.message?.includes('already been registered')) {
          return NextResponse.json(
            { error: 'Invalid password. Please try again.' },
            { status: 401 }
          );
        }
        return NextResponse.json(
          { error: signUpError.message || 'Failed to create account' },
          { status: 400 }
        );
      }

      // admin.createUser returns { user } not { user, session }
      const user = signUpData?.user;
      if (user) {
        return NextResponse.json({
          success: true,
          message: 'Account created! You can now log in.',
          user: {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || email.split('@')[0],
            verified: true
          },
          newAccount: true
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
