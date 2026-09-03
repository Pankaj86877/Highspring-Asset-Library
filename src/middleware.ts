import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('auth_session')?.value;
  let sessionData = null;

  if (sessionCookie) {
    try {
      const decoded = Buffer.from(sessionCookie, 'base64').toString('utf8');
      sessionData = JSON.parse(decoded);
    } catch {
      // Ignore
    }
  }

  const isAuthenticated = !!sessionData;
  const role = sessionData?.role;

  // Redirect to dashboard if logged in and visiting login page
  if (isAuthenticated && pathname === '/login') {
    if (role === 'Requester') {
      return NextResponse.redirect(new URL('/requests', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If NOT authenticated, redirect to login page
  if (!isAuthenticated && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based restrictions
  if (isAuthenticated) {
    // Admin routes
    if (pathname.startsWith('/admin')) {
      if (role !== 'Admin') {
        if (role === 'Requester') {
          return NextResponse.redirect(new URL('/requests', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Requester routes (Requesters should only access /requests or /login, block them from / )
    if (role === 'Requester' && pathname === '/') {
      return NextResponse.redirect(new URL('/requests', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
