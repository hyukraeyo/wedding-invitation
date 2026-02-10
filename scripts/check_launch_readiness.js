const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_BASE_URL = 'https://banana-wedding.vercel.app';

const REQUIRED_KEYS = [
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

const VERIFICATION_KEYS = ['GOOGLE_SITE_VERIFICATION', 'NAVER_SITE_VERIFICATION'];

function parseArgs(argv) {
  let envFile;
  let strictVerification = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--strict-verification') {
      strictVerification = true;
      continue;
    }

    if (arg.startsWith('--env-file=')) {
      envFile = arg.slice('--env-file='.length);
      continue;
    }

    if (arg === '--env-file') {
      envFile = argv[index + 1];
      index += 1;
    }
  }

  return { envFile, strictVerification };
}

function normalizeEnvValue(value) {
  const trimmed = value.trim();
  const singleQuoted = trimmed.startsWith("'") && trimmed.endsWith("'");
  const doubleQuoted = trimmed.startsWith('"') && trimmed.endsWith('"');

  if (singleQuoted || doubleQuoted) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseEnvFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const normalizedLine = line.startsWith('export ') ? line.slice(7).trim() : line;
    const separatorIndex = normalizedLine.indexOf('=');
    if (separatorIndex < 0) continue;

    const key = normalizedLine.slice(0, separatorIndex).trim();
    const value = normalizeEnvValue(normalizedLine.slice(separatorIndex + 1));
    env[key] = value;
  }

  return env;
}

function resolveEnvFiles(explicitEnvFile) {
  if (explicitEnvFile) {
    const resolvedPath = path.resolve(explicitEnvFile);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`Missing env file: ${explicitEnvFile}`);
      process.exit(1);
    }

    return [resolvedPath];
  }

  const localPath = path.resolve('.env.local');
  const downloadPath = path.resolve('.env.download');
  const examplePath = path.resolve('.env.example');

  const hasLocal = fs.existsSync(localPath);
  const hasDownload = fs.existsSync(downloadPath);
  const hasExample = fs.existsSync(examplePath);

  if (hasLocal) {
    return hasDownload ? [downloadPath, localPath] : [localPath];
  }

  if (hasDownload) {
    return [downloadPath];
  }

  if (hasExample) {
    return [examplePath];
  }

  if (!hasExample) {
    console.error('No env file found. Expected one of: .env.local, .env.download, .env.example');
    process.exit(1);
  }
}

function mergeEnv(envFiles) {
  const merged = {};

  for (const envFile of envFiles) {
    Object.assign(merged, parseEnvFile(envFile));
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string' && value.length > 0) {
      merged[key] = value;
    }
  }

  return merged;
}

function hasValue(env, key) {
  return Boolean(env[key] && String(env[key]).trim().length > 0);
}

function printResult(label, ok) {
  console.log(`${ok ? 'OK ' : 'NO '} ${label}`);
}

function toValidBaseUrl(rawUrl) {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) return DEFAULT_BASE_URL;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString().replace(/\/+$/, '');
  } catch {
    return DEFAULT_BASE_URL;
  }
}

function main() {
  const { envFile, strictVerification } = parseArgs(process.argv.slice(2));
  const envFiles = resolveEnvFiles(envFile);
  const env = mergeEnv(envFiles);

  console.log('========================================');
  console.log('Launch readiness check (local config)');
  console.log('========================================');
  console.log(`Env sources: ${envFiles.map((filePath) => path.basename(filePath)).join(', ')}`);
  console.log();

  console.log('--- 1) Required environment variables ---');
  const missingRequired = [];

  for (const key of REQUIRED_KEYS) {
    const ok = hasValue(env, key);
    printResult(key, ok);
    if (!ok) missingRequired.push(key);
  }

  const hasNextAuthUrl = hasValue(env, 'NEXTAUTH_URL');
  printResult('NEXTAUTH_URL (recommended)', hasNextAuthUrl);

  const baseUrl = toValidBaseUrl(env.NEXTAUTH_URL || env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL);

  console.log('\n--- 2) OAuth callback URLs ---');
  console.log(`Kakao Redirect URI: ${baseUrl}/api/auth/callback/kakao`);
  console.log(`Naver Redirect URI: ${baseUrl}/api/auth/callback/naver`);
  console.log(`Legacy compatibility: ${baseUrl}/api/auth/naver/callback`);

  console.log('\n--- 3) Search engine URLs ---');
  console.log(`robots.txt: ${baseUrl}/robots.txt`);
  console.log(`sitemap.xml: ${baseUrl}/sitemap.xml`);

  console.log('\n--- 4) Site verification meta values ---');
  const missingVerification = [];

  for (const key of VERIFICATION_KEYS) {
    const ok = hasValue(env, key);
    printResult(key, ok);
    if (!ok) missingVerification.push(key);
  }

  console.log('\n========================================');

  if (missingRequired.length > 0) {
    console.log('Required variables are missing:');
    for (const key of missingRequired) {
      console.log(`- ${key}`);
    }
    process.exit(1);
  }

  if (strictVerification && missingVerification.length > 0) {
    console.log('Verification variables are missing in strict mode:');
    for (const key of missingVerification) {
      console.log(`- ${key}`);
    }
    process.exit(1);
  }

  if (missingVerification.length > 0) {
    console.log('Warning: verification variables are still missing.');
  }

  console.log('Launch readiness check passed.');
}

main();
