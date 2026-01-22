import { auth } from '@/auth-edge';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname, searchParams } = req.nextUrl;

  // If logged in and on login page, redirect to callbackUrl or builder
  if (isLoggedIn && pathname === '/login') {
    const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('returnTo') || '/builder';
    const targetUrl = callbackUrl.startsWith('/login') ? '/builder' : callbackUrl;
    return NextResponse.redirect(new URL(targetUrl, req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/builder/:path*', '/mypage', '/mypage/:path*', '/login'],
};
