import { SignJWT } from 'jose';

const jwtSecret = process.env.SUPABASE_JWT_SECRET!;

export async function createSupabaseJwt(userId: string) {
    const secret = new TextEncoder().encode(jwtSecret);
    return new SignJWT({ role: 'authenticated' })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(userId)
        .setAudience('authenticated')
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);
}
