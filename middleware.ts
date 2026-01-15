import { NextResponse } from 'next/server';
import { auth } from '@/auth-edge';

export default auth((request) => {
  const isLoggedIn = !!request.auth;
  const { pathname } = request.nextUrl;

  if (!isLoggedIn && pathname.startsWith('/builder')) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/builder', request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/builder/:path*', '/login'],
};
