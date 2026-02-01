import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { search } = new URL(request.url);
    const redirectUrl = new URL(`/api/auth/callback/naver${search}`, request.url);
    return NextResponse.redirect(redirectUrl);
}
