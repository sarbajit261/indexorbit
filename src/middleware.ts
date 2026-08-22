import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
];

// Routes that require admin role
const adminRoutes = [
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old /business/ URLs to /businesses/
  if (pathname.startsWith('/business/')) {
    const newPath = pathname.replace('/business/', '/businesses/');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Check for protected routes
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // In production, check auth session here
    // For demo, we'll allow access but in real app would redirect to login
    const authToken = request.cookies.get('auth-token');

    // Demo mode: allow access
    // Production: uncomment below
    // if (!authToken) {
    //   const loginUrl = new URL('/login', request.url);
    //   loginUrl.searchParams.set('redirect', pathname);
    //   return NextResponse.redirect(loginUrl);
    // }
  }

  // Check for admin routes
  const isAdminRoute = adminRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isAdminRoute) {
    // In production, check admin role here
    // const userRole = request.cookies.get('user-role');
    // if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except admin)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/(?!admin)).*)',
  ],
};
