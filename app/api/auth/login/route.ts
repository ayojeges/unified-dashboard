import { NextResponse } from 'next/server';
import { users } from '../register/route';

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

    // Check if user exists
    const user = users.get(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (in production, use proper password hashing!)
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

    // Successful login
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: user.email,
        name: user.name,
        verified: user.verified
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