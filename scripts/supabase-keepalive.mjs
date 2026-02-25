#!/usr/bin/env node

const baseUrlInput = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!baseUrlInput) {
  console.error('NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) is required.');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required.');
  process.exit(1);
}

const baseUrl = baseUrlInput.replace(/\/+$/, '');
const commonHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'X-Client-Info': 'github-action-supabase-keepalive',
};

const checks = [
  {
    name: 'REST OpenAPI',
    url: `${baseUrl}/rest/v1/`,
    headers: {
      ...commonHeaders,
      Accept: 'application/openapi+json',
    },
  },
  {
    name: 'Auth Admin Users',
    url: `${baseUrl}/auth/v1/admin/users?page=1&per_page=1`,
    headers: {
      ...commonHeaders,
      Accept: 'application/json',
    },
  },
];

async function fetchWithTimeout(url, init, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' });
  } finally {
    clearTimeout(timeout);
  }
}

async function run() {
  let successCount = 0;
  const failures = [];

  for (const check of checks) {
    try {
      const response = await fetchWithTimeout(check.url, { method: 'GET', headers: check.headers });

      if (response.ok) {
        successCount += 1;
        console.log(`✅ ${check.name} OK (${response.status})`);
        continue;
      }

      const body = (await response.text()).slice(0, 500);
      failures.push(`${check.name}: HTTP ${response.status} ${response.statusText} ${body}`);
      console.error(`❌ ${check.name} failed (${response.status})`);
    } catch (error) {
      failures.push(`${check.name}: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`❌ ${check.name} request error`);
    }
  }

  if (successCount === 0) {
    console.error('No keepalive checks succeeded.');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  if (failures.length > 0) {
    console.warn('Some checks failed, but at least one keepalive request succeeded.');
    for (const failure of failures) {
      console.warn(`- ${failure}`);
    }
  }
}

await run();
