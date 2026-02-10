const fs = require('fs');

function loadEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex < 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    env[key] = value;
  }

  return env;
}

function checkRequired(env, key) {
  return Boolean(env[key] && env[key].length > 0);
}

function printResult(label, ok) {
  console.log(`${ok ? '✅' : '❌'} ${label}`);
}

function main() {
  const envPath = '.env.local';

  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local 파일이 없습니다.');
    process.exit(1);
  }

  const env = loadEnv(envPath);

  console.log('========================================');
  console.log('🚀 런칭 준비 점검 (로컬 환경 기준)');
  console.log('========================================\n');

  console.log('--- 1) 필수 환경변수 ---');
  const requiredKeys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_BASE_URL',
    'KAKAO_CLIENT_ID',
    'KAKAO_CLIENT_SECRET',
    'NAVER_CLIENT_ID',
    'NAVER_CLIENT_SECRET',
  ];

  let hasMissingRequired = false;
  for (const key of requiredKeys) {
    const ok = checkRequired(env, key);
    printResult(key, ok);
    if (!ok) hasMissingRequired = true;
  }

  const hasNextAuthUrl = checkRequired(env, 'NEXTAUTH_URL');
  printResult('NEXTAUTH_URL (권장)', hasNextAuthUrl);

  console.log('\n--- 2) OAuth 콜백 URL ---');
  const baseUrl =
    env.NEXTAUTH_URL || env.NEXT_PUBLIC_BASE_URL || 'https://wedding-invitation-zeta-one.vercel.app';
  console.log(`카카오 Redirect URI: ${baseUrl}/api/auth/callback/kakao`);
  console.log(`네이버 Redirect URI: ${baseUrl}/api/auth/callback/naver`);
  console.log(`(레거시 호환) ${baseUrl}/api/auth/naver/callback`);

  console.log('\n--- 3) 검색 엔진 제출 URL ---');
  console.log(`robots.txt: ${baseUrl}/robots.txt`);
  console.log(`sitemap.xml: ${baseUrl}/sitemap.xml`);

  console.log('\n--- 4) 사이트 인증 메타 ---');
  printResult('GOOGLE_SITE_VERIFICATION', checkRequired(env, 'GOOGLE_SITE_VERIFICATION'));
  printResult('NAVER_SITE_VERIFICATION', checkRequired(env, 'NAVER_SITE_VERIFICATION'));

  console.log('\n========================================');
  if (hasMissingRequired) {
    console.log('⚠️  필수 환경변수 누락이 있습니다. 런칭 전 보완이 필요합니다.');
    process.exit(1);
  }
  console.log('✅ 필수 환경변수 기준 점검 완료');
}

main();
