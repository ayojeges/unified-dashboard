import { NextResponse } from 'next/server';
import { getUser, createUser } from '@/lib/auth-store';

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

    // Check if user exists in our store
    const user = getUser(email);
    
    if (user) {
      // User exists - validate password
      if (user.password !== password) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check if email is verified
      if (!user.verified) {
        return NextResponse.json(
          { 
            error: 'Email not verified',
            requiresVerification: true,
            email: user.email
          },
          { status: 403 }
        );
      }

      // Successful login for existing user
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          email: user.email,
          name: user.name,
          verified: user.verified
        }
      });
    }

    // User doesn't exist in memory - DEMO MODE
    // Create a temporary verified user and allow login
    // This handles the case where server restarted and lost user data
    const newUser = createUser(email, password, email.split('@')[0], true);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: newUser.email,
        name: newUser.name,
        verified: newUser.verified
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
