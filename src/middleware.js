import { NextResponse } from 'next/server';

export function middleware(request) {
  // We check for the cookie named 'token'
  const token = request.cookies.get('token')?.value;

  // If trying to access /create and there is no token cookie
  if (request.nextUrl.pathname.startsWith('/create') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// This 'matcher' ensures middleware only runs on specific pages
export const config = {
  matcher: ['/create/:path*'],
};