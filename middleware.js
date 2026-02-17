import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Redirect /signup to /auth/register
  if (pathname === '/signup' || pathname === '/signup/') {
    return NextResponse.redirect(new URL('/auth/register', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/signup', '/signup/']
}