import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the session ID in cookies (HttpOnly or not, middleware can read it)
  const sid = request.cookies.get('sid')?.value;
  const { pathname } = request.nextUrl;

  // Paths that are always public (in addition to the matcher exclusions)
  const publicPaths = ['/login', '/'];

  // If user is NOT logged in and tries to access a protected route
  if (!sid && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user IS logged in and tries to access login page
  if (sid && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
