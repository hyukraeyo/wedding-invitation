const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load .env.local manually (same pattern as fix_admin.js)
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach((line) => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    env[key.trim()] = rest.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const serviceClient = createClient(supabaseUrl, serviceKey);
const anonClient = createClient(supabaseUrl, anonKey);

async function checkRLS() {
  console.log('========================================');
  console.log('🔒 Supabase RLS 보안 점검 시작');
  console.log('========================================\n');

  // === 1. ANON(비인증) 사용자 접근 테스트 ===
  console.log('--- 1. 비인증(anon) 사용자 접근 테스트 ---');

  // 1-1. invitations SELECT
  const r1 = await anonClient
    .from('invitations')
    .select('id,slug,user_id,invitation_data')
    .limit(3);
  if (r1.error) {
    console.log('✅ invitations SELECT: 차단됨');
  } else {
    const count = r1.data?.length || 0;
    console.log(`⚠️  invitations SELECT: 허용됨 (${count}건 조회됨)`);
    if (count > 0) {
      console.log('   노출 컬럼:', Object.keys(r1.data[0]).join(', '));
      const invData = r1.data[0].invitation_data;
      if (invData) {
        const keys = Object.keys(invData);
        console.log('   invitation_data 내부 키:', keys.join(', '));
      }
    }
  }

  // 1-2. invitations INSERT
  const r2 = await anonClient
    .from('invitations')
    .insert({ slug: '__rls_test__', invitation_data: {} });
  if (r2.error) {
    console.log('✅ invitations INSERT: 차단됨');
  } else {
    console.log('🚨 invitations INSERT: 허용됨! (심각한 보안 문제)');
    await serviceClient.from('invitations').delete().eq('slug', '__rls_test__');
  }

  // 1-3. invitations UPDATE
  const r3 = await anonClient
    .from('invitations')
    .update({ title: '__hacked__' })
    .eq('slug', '__rls_test__');
  if (r3.error) {
    console.log('✅ invitations UPDATE: 차단됨');
  } else {
    console.log('🚨 invitations UPDATE: 허용됨! (심각한 보안 문제)');
  }

  // 1-4. invitations DELETE
  const r4 = await anonClient.from('invitations').delete().eq('slug', '__rls_test__');
  if (r4.error) {
    console.log('✅ invitations DELETE: 차단됨');
  } else {
    console.log('🚨 invitations DELETE: 허용됨! (심각한 보안 문제)');
  }

  // 1-5. profiles SELECT
  const r5 = await anonClient.from('profiles').select('id,full_name,phone,is_admin').limit(3);
  if (r5.error) {
    console.log('✅ profiles SELECT: 차단됨');
  } else {
    const count = r5.data?.length || 0;
    if (count > 0) {
      console.log(`🚨 profiles SELECT: 허용됨 (${count}건) - 개인정보 노출!`);
      console.log('   노출 컬럼:', Object.keys(r5.data[0]).join(', '));
    } else {
      console.log('✅ profiles SELECT: 0건 (정책상 차단됨)');
    }
  }

  // 1-6. approval_requests SELECT
  const r6 = await anonClient.from('approval_requests').select('id').limit(3);
  if (r6.error) {
    console.log('✅ approval_requests SELECT: 차단됨');
  } else {
    const count = r6.data?.length || 0;
    if (count > 0) {
      console.log(`⚠️  approval_requests SELECT: 허용됨 (${count}건)`);
    } else {
      console.log('✅ approval_requests SELECT: 0건 (정책상 차단됨)');
    }
  }

  // === 2. invitation_data 개인정보 노출 범위 확인 ===
  console.log('\n--- 2. invitation_data 개인정보 노출 범위 확인 ---');
  const r7 = await anonClient.from('invitations').select('invitation_data').limit(1);
  if (r7.data?.length > 0) {
    const data = r7.data[0].invitation_data;
    const sensitiveFields = [];
    if (data.groom) sensitiveFields.push('groom(신랑 정보)');
    if (data.bride) sensitiveFields.push('bride(신부 정보)');
    if (data.accounts) sensitiveFields.push('accounts(계좌 정보)');
    if (data.address) sensitiveFields.push('address(주소)');
    if (data.phone || data.groomPhone || data.bridePhone) sensitiveFields.push('phone(전화번호)');
    if (data.location) sensitiveFields.push('location(장소)');
    if (data.date) sensitiveFields.push('date(날짜)');

    if (sensitiveFields.length > 0) {
      console.log('⚠️  비인증 사용자에게 노출되는 민감 정보:');
      sensitiveFields.forEach((f) => console.log('   -', f));
      console.log('   → /v/[slug] 페이지 렌더링에 필요하므로 SELECT는 허용되나,');
      console.log('     전체 목록 조회가 가능한 것이 문제입니다.');
    }
  } else {
    console.log('✅ 조회된 초대장 없음 (데이터 없거나 차단됨)');
  }

  // === 3. Storage 접근 테스트 ===
  console.log('\n--- 3. Storage 접근 테스트 ---');
  const { data: buckets } = await serviceClient.storage.listBuckets();
  if (buckets) {
    console.log('버킷 목록:', buckets.map((b) => `${b.name}(public:${b.public})`).join(', '));
  }

  // === 4. 종합 진단 ===
  console.log('\n========================================');
  console.log('📋 종합 진단 결과');
  console.log('========================================');

  const hasPublicRead = !r1.error && (r1.data?.length || 0) > 0;

  if (hasPublicRead) {
    console.log('\n🟡 주의사항:');
    console.log('   invitations 테이블이 anon에게 SELECT 허용됨.');
    console.log('   → /v/[slug] 페이지가 서버 컴포넌트에서 service_role로');
    console.log('     데이터를 가져오므로, anon SELECT 정책은 불필요할 수 있음.');
    console.log('   → 현재 구조에서는 anon SELECT를 제거하고 service_role만');
    console.log('     허용하는 것이 더 안전합니다.');
  }

  process.exit(0);
}

checkRLS().catch((e) => {
  console.error('스크립트 오류:', e.message);
  process.exit(1);
});
