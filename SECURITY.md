# 🔒 바나나웨딩 보안 가이드

본 문서는 바나나웨딩 프로젝트의 보안 정책, 인증 메커니즘, 데이터 보호 및 개발 시 보안 수칙을 정의합니다.

---

## 1. 보안 원칙 및 목표

### 🎯 핵심 보안 목표
- **데이터 보호**: 사용자 개인정보 및 결제 정보 보호
- **인증/인가**: 신뢰할 수 있는 사용자 식별 및 접근 제어
- **개인정보보호**: GDPR 및 국내 개인정보보호법 준수
- **보안 모니터링**: 실시간 위협 탐지 및 대응

### 🛡️ 보안 레이어 구조
```
┌─────────────────────────────────────┐
│        Frontend Security            │ ← CSP, XSS 방어, 입력 검증
├─────────────────────────────────────┤
│       API Gateway & Rate Limit     │ ← WAF, DDoS 방어, 요청 제한
├─────────────────────────────────────┤
│     Authentication & Authorization  │ ← Supabase Auth, JWT, RBAC
├─────────────────────────────────────┤
│        Backend Security            │ ← Server Actions, SQL Injection 방어
├─────────────────────────────────────┤
│       Database Security            │ ← RLS, 암호화, 백업
├─────────────────────────────────────┤
│      Infrastructure Security        │ ← VPC, SSL/TLS, 모니터링
└─────────────────────────────────────┘
```

---

## 2. 인증 및 인가 시스템

### 🔑 Supabase Auth 설정

#### 사용자 인증 흐름
```typescript
// 1. 회원가입
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123!',
  options: {
    data: {
      full_name: '홍길동',
      phone: '+82-10-1234-5678'
    }
  }
});

// 2. 이메일 인증 확인
const { data, error } = await supabase.auth.verifyOtp({
  token: '123456',
  type: 'signup',
  email: 'user@example.com'
});

// 3. 로그인
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123!'
});
```

#### 세션 관리
```typescript
// 클라이언트 사이드 세션 확인
const { data: { session } } = await supabase.auth.getSession();

// 서버 컴포넌트에서 인증 확인
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function ProtectedPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  // 보호된 컨텐츠 렌더링
}
```

### 🔐 JWT 토큰 관리

#### 토큰 구조
```json
{
  "aud": "authenticated",
  "exp": 1672531200,
  "sub": "12345678-1234-1234-1234-123456789012",
  "email": "user@example.com",
  "role": "authenticated",
  "app_metadata": {
    "provider": "email"
  },
  "user_metadata": {
    "full_name": "홍길동",
    "phone": "+82-10-1234-5678"
  }
}
```

#### Server Actions에서의 인증
```typescript
'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function updateInvitation(invitationId: string, formData: FormData) {
  const supabase = createServerActionClient({ cookies })
  
  // 현재 사용자 인증 확인
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) {
    throw new Error('인증되지 않은 요청입니다.')
  }
  
  // 소유권 확인
  const { data: invitation, error: fetchError } = await supabase
    .from('invitations')
    .select('user_id')
    .eq('id', invitationId)
    .single()
    
  if (fetchError || invitation?.user_id !== user.id) {
    throw new Error('접근 권한이 없습니다.')
  }
  
  // 데이터 업데이트
  const { data, error: updateError } = await supabase
    .from('invitations')
    .update({
      title: formData.get('title') as string,
      updated_at: new Date().toISOString()
    })
    .eq('id', invitationId)
    .select()
    .single()
    
  if (updateError) {
    throw new Error('업데이트에 실패했습니다.')
  }
  
  revalidatePath('/builder')
  return data
}
```

---

## 3. 데이터베이스 보안

### 🛡️ Row Level Security (RLS)

#### 청첩장 테이블 RLS 정책
```sql
-- invitations 테이블에 RLS 활성화
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 청첩장만 조회/수정 가능
CREATE POLICY "Users can view own invitations" ON invitations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invitations" ON invitations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations" ON invitations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invitations" ON invitations
  FOR DELETE USING (auth.uid() = user_id);
```

#### 공개 청첩장 접근 정책
```sql
-- published 상태인 청첩장은 누구나 조회 가능
CREATE POLICY "Published invitations are publicly viewable" ON invitations
  FOR SELECT USING (published = true);

-- gallery_images 테이블 RLS
CREATE POLICY "Gallery images are viewable with invitation" ON gallery_images
  FOR SELECT USING (
    invitations_id IN (
      SELECT id FROM invitations 
      WHERE published = true OR auth.uid() = user_id
    )
  );
```

### 🔒 민감정보 암호화

#### 결제 정보 처리
```typescript
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
const ALGORITHM = 'aes-256-gcm'

export function encrypt(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
  cipher.setAAD(Buffer.from('wedding-invitation', 'utf8'))
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const tag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  }
}

export function decrypt(encryptedData: { encrypted: string; iv: string; tag: string }): string {
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
  decipher.setAAD(Buffer.from('wedding-invitation', 'utf8'))
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'))
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
```

---

## 4. 프론트엔드 보안

### 🛡️ XSS (Cross-Site Scripting) 방어

#### 입력 검증 및 이스케이프
```typescript
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// 서버 사이드 DOMPurify 설정
const window = new JSDOM('').window
const purify = DOMPurify(window)

export function sanitizeHtml(dirty: string): string {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false
  })
}

// 사용자 입력 처리
export function processUserInput(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('잘못된 입력 형식입니다.')
  }
  
  // 길이 제한
  if (input.length > 1000) {
    throw new Error('입력 길이가 너무 깁니다.')
  }
  
  return sanitizeHtml(input.trim())
}
```

#### CSP (Content Security Policy) 설정
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.supabase.co https://*.kakao.com https://*.naver.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  }
}
```

### 🔐 API 요청 보안

#### Rate Limiting 구현
```typescript
import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(request: NextRequest, limit: number = 60, windowMs: number = 60000): boolean {
  const ip = request.ip || 'anonymous'
  const now = Date.now()
  const key = `${ip}:${Math.floor(now / windowMs)}`
  
  const current = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  rateLimitMap.set(key, current)
  
  // 오래된 항목 정리
  setTimeout(() => {
    rateLimitMap.delete(key)
  }, windowMs)
  
  return true
}

// API Route에서 사용
export async function POST(request: NextRequest) {
  if (!rateLimit(request, 10, 60000)) {
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    )
  }
  
  // API 로직...
}
```

---

## 5. 개발 시 보안 수칙

### 🔒 환경변수 관리

#### .env.local 설정
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 암호화
ENCRYPTION_KEY=your-32-character-encryption-key

# 외부 API
KAKAO_REST_API_KEY=your-kakao-api-key
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

# 보안 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

#### GitHub Secrets 설정
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}
          KAKAO_REST_API_KEY: ${{ secrets.KAKAO_REST_API_KEY }}
```

### 🛡️ 코드 보안 검토

#### 정적 보안 분석
```bash
# npm audit으로 취약점 확인
npm audit

# Semgrep으로 보안 취약점 스캔
npm install -g semgrep
semgrep --config=auto src/

# Type-check로 타입 안전성 확보
npm run type-check
```

#### 보안 관련 ESLint 규칙
```json
{
  "extends": [
    "plugin:security/recommended"
  ],
  "rules": {
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-new-buffer": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "error",
    "security/detect-non-literal-require": "error",
    "security/detect-possible-timing-attacks": "error",
    "security/detect-pseudoRandomBytes": "error"
  }
}
```

---

## 6. 모니터링 및 로깅

### 📊 보안 이벤트 모니터링

#### 로그 수집 구조
```typescript
interface SecurityEvent {
  timestamp: string
  event_type: 'auth_success' | 'auth_failure' | 'access_denied' | 'suspicious_activity'
  user_id?: string
  ip_address: string
  user_agent: string
  metadata: Record<string, unknown>
}

export async function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>) {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString()
  }
  
  // Supabase에 로그 저장
  await supabase
    .from('security_logs')
    .insert(securityEvent)
    
  // 심각한 이벤트는 관리자에게 알림
  if (event.event_type === 'access_denied' || event.event_type === 'suspicious_activity') {
    await notifySecurityTeam(securityEvent)
  }
}
```

#### 접근 제어 로깅
```typescript
// Server Actions에서 접근 로깅
export async function updateInvitation(invitationId: string, formData: FormData) {
  const supabase = createServerActionClient({ cookies })
  const request = await request()
  
  // 접근 시도 로깅
  await logSecurityEvent({
    event_type: 'access_attempt',
    ip_address: request.ip || 'unknown',
    user_agent: request.headers.get('user-agent') || 'unknown',
    metadata: {
      action: 'update_invitation',
      invitation_id: invitationId
    }
  })
  
  // 인증 확인
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user) {
    await logSecurityEvent({
      event_type: 'access_denied',
      ip_address: request.ip || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      metadata: {
        reason: 'unauthenticated',
        invitation_id: invitationId
      }
    })
    throw new Error('인증되지 않은 요청입니다.')
  }
  
  // ... 나머지 로직
}
```

---

## 7. 개인정보보호 및 규정 준수

### 📋 GDPR 및 개인정보보호법 준수

#### 데이터 처리 기록
```typescript
interface DataProcessingRecord {
  data_subject: string
  processing_purpose: string
  legal_basis: string
  data_categories: string[]
  retention_period: string
  security_measures: string[]
}

export const processingRecords: DataProcessingRecord[] = [
  {
    data_subject: '청첩장 사용자',
    processing_purpose: '청첩장 생성 및 관리',
    legal_basis: '동의',
    data_categories: ['이메일', '이름', '연락처', '결혼 정보'],
    retention_period: '서비스 종료 시까지',
    security_measures: ['암호화', '접근 제어', '정기적 감사']
  }
]
```

#### 사용자 데이터 권한 관리
```typescript
// 데이터 내보내기 (GDPR Right to Data Portability)
export async function exportUserData(userId: string) {
  const supabase = createServerActionClient({ cookies })
  
  const [invitations, userProfile, galleryImages] = await Promise.all([
    supabase.from('invitations').select('*').eq('user_id', userId),
    supabase.from('user_profiles').select('*').eq('user_id', userId),
    supabase.from('gallery_images').select('*').eq('user_id', userId)
  ])
  
  return {
    user_id: userId,
    export_date: new Date().toISOString(),
    data: {
      invitations: invitations.data,
      profile: userProfile.data,
      gallery_images: galleryImages.data
    }
  }
}

// 계정 삭제 (GDPR Right to Erasure)
export async function deleteUserAccount(userId: string) {
  const supabase = createServerActionClient({ cookies })
  
  // 1. 관련 데이터 먼저 삭제
  await Promise.all([
    supabase.from('gallery_images').delete().eq('user_id', userId),
    supabase.from('invitations').delete().eq('user_id', userId),
    supabase.from('user_profiles').delete().eq('user_id', userId)
  ])
  
  // 2. 인증 사용자 삭제
  const { error } = await supabase.auth.admin.deleteUser(userId)
  
  if (error) {
    throw new Error('계정 삭제에 실패했습니다.')
  }
  
  // 3. 삭제 로그 기록
  await logSecurityEvent({
    event_type: 'account_deleted',
    user_id: userId,
    ip_address: 'system',
    user_agent: 'system',
    metadata: {
      reason: 'user_request'
    }
  })
}
```

---

## 8. 보안 체크리스트

### ✅ 개발 단계 체크리스트

#### 초기 설정
- [ ] Supabase RLS 정책 설정 완료
- [ ] 환경변수 보안 설정 완료
- [ ] CSP 헤더 설정 완료
- [ ] HTTPS/SSL 인증서 설정 완료

#### 개발 과정
- [ ] 모든 사용자 입력 검증 및 이스케이프 처리
- [ ] 인증/인가 로직 Server Actions로 구현
- [ ] 민감정보 암호화 처리
- [ ] Rate Limiting 구현
- [ ] 보안 로깅 시스템 구축

#### 배포 전
- [ ] npm audit 실행 및 취약점 해결
- [ ] Semgrep 보안 스캔 실행
- [ ] 타입스크립트 엄격 모드 검사
- [ ] 환경변수 검토 및 최소화
- [ ] 접근 테스트 수행

### 🔍 정기 보안 점검

#### 월간 점검
- [ ] 의존성 취약점 스캔
- [ ] 보안 로그 리뷰
- [ ] 접근 제어 정책 검토
- [ ] 데이터 보호 조치 확인

#### 분기별 점검
- [ ] 전체 보안 아키텍처 리뷰
- [ ] 개인정보처리방침 업데이트
- [ ] 보안 교육 및 훈련 실시
- [ ] 침투 테스트 수행

---

## 9. 보안 이슈 대응 절차

### 🚨 보안 사고 대응

#### 1단계: 탐지
- 보안 모니터링 시스템의 이상 탐지
- 사용자 신고 및 외부 알림 접수
- 자동화된 스캔 및 경고 시스템

#### 2단계: 분석
- 영향 범위 및 심각도 평가
- 원인 분석 및 공격 경로 추적
- 관련 시스템 및 데이터 확인

#### 3단계: 대응
- 즉각적인 영향 차단 및 격리
- 취약점 패치 및 시스템 강화
- 피해 복구 및 서비스 복원

#### 4단계: 보고 및 후속 조치
- 관련 당국 및 이해관계자 통보
- 사고 보고서 작성
- 재발 방지 대책 수립 및 이행

### 📞 연락처
- **보안팀**: security@bananawedding.com
- **개발팀**: dev@bananawedding.com
- **법률 자문**: legal@bananawedding.com

---

> **보안은 일회성 작업이 아닌 지속적인 과정입니다.** 모든 개발자는 보안 원칙을 숙지하고 실천해야 하며, 정기적인 보안 교육과 점검에 참여해야 합니다. 보안과 관련된 모든 의문사항은 즉시 보안팀에 문의해 주시기 바랍니다.