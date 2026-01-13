import { z } from 'zod';

const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Maps (Kakao/Naver)
  NEXT_PUBLIC_KAKAO_MAP_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_NAVER_MAP_CLIENT_ID: z.string().min(1).optional(),

  // Application
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .filter((issue) => issue.code === 'invalid_type')
        .map((issue) => issue.path.join('.'));

      if (missingVars.length > 0) {
        console.error('❌ Missing or invalid environment variables:');
        missingVars.forEach((varName) => {
          console.error(`   - ${varName}`);
        });
        console.error('\nPlease check your .env.local file or environment configuration.');
      }
    }

    throw new Error('Invalid environment configuration');
  }
}

export const env = validateEnv();
