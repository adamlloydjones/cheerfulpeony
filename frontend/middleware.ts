import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('nf_jwt');

  // If no token, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Protect everything except the login page and static assets
export const config = {
  matcher: ['/((?!login|_next|favicon.ico|public).*)'],
};
