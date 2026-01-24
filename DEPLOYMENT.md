# 🚀 바나나웨딩 배포 및 운영 가이드

본 문서는 바나나웨딩 프로젝트의 배포 전략, 운영 환경 설정, 그리고 모니터링을 위한 가이드를 제공합니다.

---

## 1. 배포 전략 개요

### 🎯 배포 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│   Vercel Build  │───▶│  Production     │
│                 │    │                 │    │  (Global CDN)   │
│ - Main Branch   │    │ - Next.js Build │    │                 │
│ - PR Review     │    │ - Asset Optimize│    │ - Edge Network  │
│ - CI/CD         │    │ - Bundle Analyze│    │ - Auto HTTPS    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Staging Env   │    │   Supabase DB   │    │  Monitoring     │
│                 │    │                 │    │                 │
│ - Preview URLs  │    │ - Database     │    │ - Vercel Analytics│
│ - E2E Testing   │    │ - Auth Service  │    │ - Uptime Monitor │
│ - Performance   │    │ - Storage       │    │ - Error Tracking│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔄 배포 흐름

#### Git 기반 배포 프로세스
```mermaid
gitGraph
    commit id: "feat: initial setup"
    branch develop
    checkout develop
    commit id: "feat: auth system"
    commit id: "feat: invitation builder"
    checkout main
    merge develop
    commit id: "chore: release v1.0.0"
    
    develop
    commit id: "fix: mobile layout"
    checkout main
    merge develop tag: "v1.0.1"
```

---

## 2. 환경 설정 및 변수

### 🔧 Vercel 환경 변수

#### Production 환경
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External APIs
KAKAO_REST_API_KEY=your-kakao-rest-api-key
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

# Application Settings
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret
ENCRYPTION_KEY=your-32-character-encryption-key

# Analytics & Monitoring
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VERCEL_ANALYTICS_ID=your-vercel-analytics-id
SENTRY_DSN=your-sentry-dsn
```

#### Staging/Preview 환경
```bash
# Preview 환경별 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key

# 테스트용 API 키
KAKAO_REST_API_KEY=${KAKAO_REST_API_KEY_TEST}
NAVER_CLIENT_ID=${NAVER_CLIENT_ID_TEST}

# Development 특정 설정
NEXTAUTH_URL=https://your-app-git-branch-username.vercel.app
ANALYTICS_DISABLED=true
```

### 🌐 도메인 및 SSL 설정

#### 커스텀 도메인 설정
```bash
# Vercel CLI를 통한 도메인 추가
vercel domains add bananawedding.com
vercel domains add www.bananawedding.com

# 자동 리디렉션 설정
vercel alias https://bananawedding.com.vercel.app bananawedding.com
```

#### DNS 설정 예시
```
Type    Name                Value
A       bananawedding.com   76.76.19.19
CNAME   www                 cname.vercel-dns.com
TXT     _dmarc              "v=DMARC1; p=quarantine; rua=mailto:dmarc@bananawedding.com"
```

---

## 3. CI/CD 파이프라인

### 🔄 GitHub Actions 워크플로우

#### 배포 전 검증 (test.yml)
```yaml
name: Test and Quality Checks

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type check
        run: npm run type-check
        
      - name: Lint
        run: npm run lint
        
      - name: Unit tests
        run: npm run test:coverage
        
      - name: E2E tests
        run: npm run test:e2e:headless
        
      - name: Security audit
        run: npm audit --audit-level moderate
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

#### Vercel 자동 배포 설정
```yaml
# .github/workflows/deploy-preview.yml
name: Deploy Preview

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

---

## 4. Vercel 배포 설정

### ⚙️ Vercel 구성 파일

#### vercel.json
```json
{
  "version": 2,
  "name": "banana-wedding",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "regions": ["sin1", "hkg1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://api.supabase.co https://*.kakao.com https://*.naver.com;"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    },
    {
      "source": "/wedding/:path*",
      "destination": "/invitation/:path*",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    },
    {
      "source": "/robots.txt",
      "destination": "/api/robots"
    }
  ]
}
```

#### next.config.js (Vercel 최적화)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  }
}

module.exports = nextConfig
```

---

## 5. Supabase 운영

### 🗄️ 데이터베이스 백업 및 복구

#### 자동 백업 설정
```sql
-- 백업 정책 설정
-- 1. 일간 자동 백업 (Supabase 기본 기능)
-- 2. 주간 PITR (Point-in-Time Recovery) 설정
-- 3. 중요 테이블 수동 백업 스크립트

-- 사용자 데이터 백업 쿼리
CREATE OR REPLACE FUNCTION backup_user_data()
RETURNS void AS $$
DECLARE
    backup_timestamp timestamptz := NOW();
BEGIN
    -- invitations 테이블 백업
    EXECUTE format('
        CREATE TABLE invitations_backup_%s AS 
        SELECT * FROM invitations WHERE updated_at >= %L',
        to_char(backup_timestamp, 'YYYY_MM_DD_HH24_MI'),
        backup_timestamp - interval '7 days'
    );
    
    -- user_profiles 테이블 백업
    EXECUTE format('
        CREATE TABLE user_profiles_backup_%s AS 
        SELECT * FROM user_profiles WHERE updated_at >= %L',
        to_char(backup_timestamp, 'YYYY_MM_DD_HH24_MI'),
        backup_timestamp - interval '7 days'
    );
END;
$$ LANGUAGE plpgsql;
```

#### 데이터베이스 모니터링 쿼리
```sql
-- 성능 모니터링
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- 쿼리 성능 분석
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

### 🔐 Supabase 보안 설정

#### RLS (Row Level Security) 강화
```sql
-- invitations 테이블 RLS 정책
CREATE POLICY "Users can view own invitations" ON invitations
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (published = true AND auth.role() = 'anon')
  );

CREATE POLICY "Users can insert own invitations" ON invitations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invitations" ON invitations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invitations" ON invitations
  FOR DELETE USING (auth.uid() = user_id);

-- gallery_images 테이블 RLS 정책
CREATE POLICY "Gallery images are accessible with invitation" ON gallery_images
  FOR SELECT USING (
    invitations_id IN (
      SELECT id FROM invitations 
      WHERE published = true OR auth.uid() = invitations.user_id
    )
  );
```

---

## 6. 모니터링 및 로깅

### 📊 성능 모니터링

#### Vercel Analytics 설정
```typescript
// next.config.js
const nextConfig = {
  experimental: {
    instrument: true, // Vercel Speed Insights 활성화
  },
  analytics: {
    // Vercel Web Analytics 활성화
    // 자동으로 page views, web vitals 수집
  }
}
```

#### 커스텀 성능 측정
```typescript
// lib/analytics.ts
export function trackWebVitals(metric: any) {
  // Vercel Analytics로 성능 데이터 전송
  if (window.va) {
    window.va('track', metric)
  }
  
  // 커스텀 이벤트 추적
  if (metric.name === 'LCP') {
    // LCP 2.5초 초과 시 알림
    if (metric.value > 2500) {
      console.warn('LCP threshold exceeded:', metric.value)
    }
  }
}

// 페이지 뷰 추적
export function trackPageView(path: string) {
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path
    })
  }
  
  if (window.va) {
    window.va('track', 'pageview', { path })
  }
}
```

#### 에러 트래킹 (Sentry)
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1, // 10% 트랜잭션 샘플링
    beforeSend(event) {
      // 민감정보 필터링
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (error?.value?.includes('password')) {
          return null
        }
      }
      return event
    }
  })
}

// 커스텀 에러 리포팅
export function reportError(error: Error, context?: Record<string, any>) {
  console.error(error)
  
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.captureException(error, {
      extra: context
    })
  }
}
```

### 🔍 실시간 모니터링

#### Uptime 모니터링 설정
```yaml
# .github/workflows/uptime-monitor.yml
name: Uptime Monitor

on:
  schedule:
    - cron: '*/5 * * * *'  # 5분마다 실행

jobs:
  check-uptime:
    runs-on: ubuntu-latest
    
    steps:
      - name: Check main site
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" https://bananawedding.com)
          if [ $response -ne 200 ]; then
            echo "Site is down! Status code: $response"
            exit 1
          fi
          
      - name: Check API endpoints
        run: |
          # API 헬스체크
          curl -f https://bananawedding.com/api/health || exit 1
          
          # Supabase 연결 확인
          curl -f https://bananawedding.com/api/health/database || exit 1
          
      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
          text: "🚨 Banana Wedding site is down!"
```

#### Health Check API
```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // 기본 헬스체크
    const startTime = Date.now()
    
    // Supabase 연결 확인
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { error } = await supabase.from('invitations').select('id').limit(1)
    
    const responseTime = Date.now() - startTime
    
    if (error) {
      throw new Error('Database connection failed')
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: 'healthy',
        api: 'healthy'
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
```

---

## 7. 롤아웃 전략

### 🔄 배포 방법론

#### Blue-Green Deployment (Vercel 자동)
```bash
# Vercel은 자동으로 Blue-Green 배포를 수행
# 1. 새로운 빌드 생성 (Green)
# 2. 헬스체크 통과 후 트래픽 전환
# 3. 이전 버전 (Blue)는 롤백용으로 보존
```

#### 기능 플래그를 이른 안전한 배포
```typescript
// lib/featureFlags.ts
export const featureFlags = {
  NEW_GALLERY_VIEW: process.env.FEATURE_NEW_GALLERY === 'true',
  KAKAO_LOGIN: process.env.FEATURE_KAKAO_LOGIN === 'true',
  AI_RECOMMENDATIONS: process.env.FEATURE_AI === 'true'
}

// 컴포넌트에서 사용
import { featureFlags } from '@/lib/featureFlags'

export function GallerySection() {
  if (featureFlags.NEW_GALLERY_VIEW) {
    return <NewGalleryView />
  }
  return <LegacyGalleryView />
}
```

#### Canary Release 점진적 롤아웃
```typescript
// lib/canary.ts
export function shouldUseCanary(userId: string): boolean {
  const canaryPercentage = Number(process.env.CANARY_PERCENTAGE) || 0
  
  if (canaryPercentage === 0) return false
  if (canaryPercentage === 100) return true
  
  // 사용자 ID 기반 해시로 일관된 결정
  const hash = userId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)
  
  return (hash % 100) < canaryPercentage
}
```

---

## 8. 재해 복구 계획

### 🚨 긴급 대응 절차

#### 1. 사고 감지 단계
- 자동 모니터링 알림 (Uptime, Error Rate)
- 사용자 신고 접수
- 로그 및 메트릭 분석

#### 2. 즉각 대응 단계 (5분 내)
```bash
# 1. 현재 배포 상태 확인
vercel ls

# 2. 문제 발생 전 버전으로 롤백
vercel rollback [deployment-url]

# 3. 롤백 확인
curl -f https://bananawedding.com/health
```

#### 3. 근본 원인 분석
```typescript
// 사고 로그 수집
interface IncidentLog {
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  service: string
  error: string
  context: Record<string, unknown>
  resolved: boolean
}

export async function logIncident(incident: Omit<IncidentLog, 'timestamp'>) {
  const log: IncidentLog = {
    ...incident,
    timestamp: new Date().toISOString()
  }
  
  // 외부 로깅 서비스로 전송
  await sendToLoggingService(log)
  
  // 슬랙 알림
  if (incident.severity === 'critical') {
    await sendSlackAlert(`🚨 Critical: ${incident.error}`)
  }
}
```

#### 4. 사후 분석 및 개선
- 사고 보고서 작성 (5 Why 분석)
- 개선 대책 수립 및 이행
- 재발 방지 시스템 구축

---

## 9. 성능 최적화 배포

### ⚡ 빌드 최적화

#### Webpack 번들 최적화
```javascript
// next.config.js
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true
            }
          }
        }
      }
    }
    return config
  }
}
```

#### 이미지 최적화 자동화
```typescript
// lib/imageOptimizer.ts
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'

export async function getOptimizedImage(src: string) {
  try {
    // 이미지 로드 및 최적화
    const buffer = await fetch(src).then(res => res.arrayBuffer())
    const { base64, img } = await getPlaiceholder(Buffer.from(buffer))
    
    return {
      src,
      width: img.width,
      height: img.height,
      placeholder: 'blur',
      blurDataURL: base64
    }
  } catch (error) {
    console.error('Image optimization failed:', error)
    return {
      src,
      width: 400,
      height: 300,
      placeholder: 'empty'
    }
  }
}
```

---

## 10. 운영 체크리스트

### ✅ 배포 전 체크리스트

#### 코드 품질
- [ ] 모든 테스트 통과 (Unit, Integration, E2E)
- [ ] 타입스크립트 컴파일 에러 없음
- [ ] ESLint 검증 통과
- [ ] 보안 취약점 검증 완료
- [ ] 성능 분석 결과 수용 (Lighthouse 90점 이상)

#### 환경 설정
- [ ] Production 환경변수 설정 완료
- [ ] 도메인 및 DNS 설정 확인
- [ ] SSL/HTTPS 인증서 확인
- [ ] 데이터베이스 마이그레이션 준비
- [ ] 외부 API 키 설정 확인

#### 기능 검증
- [ ] 핵심 기능 동작 확인
- [ ] 모바일/데스크톱 반응형 확인
- [ ] 접근성 기능 확인
- [ ] 성능 메트릭 확인 (Core Web Vitals)
- [ ] 에러 핸들링 및 사용자 피드백 확인

### 🔍 운영 중 모니터링 항목

#### 매일 확인
- [ ] 사이트 가용성 (99.9% 이상)
- [ ] 평균 응답 시간 (2초 이하)
- [ ] 에러 로그 확인
- [ ] 데이터베이스 성능 확인
- [ ] 사용자 피드백 확인

#### 주간 확인
- [ ] 보안 패치 및 업데이트
- [ ] 의존성 취약점 스캔
- [ ] 백업 정상 동작 확인
- [ ] 성능 트렌드 분석
- [ ] 비용 최적화 검토

#### 월간 확인
- [ ] 전체 시스템 아키텍처 리뷰
- [ ] 재해 복구 훈련
- [ ] 용량 확장 계획 수립
- [ ] 사용자 데이터 분석
- [ ] 개선 사항 우선순위 결정

---

## 11. 비용 최적화

### 💰 Vercel 비용 관리

#### Edge Functions 최적화
```typescript
// Edge Functions cold start 방지
export const config = {
  runtime: 'edge',
  regions: ['sin1', 'hkg1', 'icn1'], // 사용자 가까운 리전 선택
  maxDuration: 10 // 최대 실행 시간 최적화
}

// 캐싱 전략
export async function GET(request: Request) {
  const cache = caches.default
  const cacheKey = new Request(request.url)
  
  // 캐시 확인
  let response = await cache.match(cacheKey)
  
  if (!response) {
    // 데이터 생성
    const data = await fetchData()
    response = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    })
    
    // 캐시 저장
    cache.put(cacheKey, response.clone())
  }
  
  return response
}
```

#### 데이터베이스 비용 최적화
```sql
-- 인덱스 최적화
CREATE INDEX CONCURRENTLY idx_invitations_published 
ON invitations(published) WHERE published = true;

CREATE INDEX CONCURRENTLY idx_invitations_user_updated 
ON invitations(user_id, updated_at DESC);

-- 파티셔닝으로 대용량 데이터 관리
CREATE TABLE invitations_2024 PARTITION OF invitations
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## 12. 문서화 및 지식 관리

### 📚 운영 문서 유지

#### 시스템 아키텍처 문서
- 인프라 구조 다이어그램
- 데이터 흐름 맵
- 서비스 의존성 관계
- 장애 전파 경로 분석

#### 운영 매뉴얼
- 일일/주간/월간 운영 절차
- 장애 대응 매뉴얼
- 롤백 절차
- 연락처 및 책임자 정보

#### 모니터링 가이드
- 각 메트릭의 의미와 기준값
- 알림 설정 및 대응 절차
- 분석 도구 사용법
- 보고서 생성 방법

---

> **운영은 시작이지 끝이 아닙니다.** 지속적인 모니터링, 개선, 그리고 학습을 통해 안정적인 서비스를 제공해야 합니다. 모든 운영 팀원은 이 가이드를 숙지하고, 정기적인 검토와 업데이트에 참여해 주시기 바랍니다.