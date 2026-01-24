# ⚡ 바나나웨딩 성능 최적화 및 모니터링 가이드

본 문서는 바나나웨딩 프로젝트의 성능 최적화 전략, Core Web Vitals 개선, 그리고 실시간 모니터링을 위한 가이드를 제공합니다.

---

## 1. 성능 목표 및 기준

### 🎯 Core Web Vitals 목표

| 지표 | 목표치 | 현재 기준 | 중요도 |
|------|--------|----------|--------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5초 | 1.8초 | 🔴 Critical |
| **FID** (First Input Delay) | ≤ 100ms | 50ms | 🔴 Critical |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.05 | 🔴 Critical |
| **TTI** (Time to Interactive) | ≤ 3.8초 | 2.5초 | 🟡 Important |
| **FCP** (First Contentful Paint) | ≤ 1.8초 | 1.2초 | 🟡 Important |

### 📊 성능 등급 기준

```
🟢 Good (초록색):   사용자 경험에 긍정적 영향
🟡 Needs Improvement: 개선이 필요한 상태
🔴 Poor (빨간색):    즉각적인 개선이 필요
```

---

## 2. 렌더링 성능 최적화

### 🚀 Server Components 최적화

#### 데이터 페칭 전략
```typescript
// ✅ 좋은 예: 병렬 데이터 페칭
async function getInvitationData(id: string) {
  const [invitation, gallery, theme] = await Promise.all([
    db.invitation.findUnique({ where: { id } }),
    db.galleryImage.findMany({ where: { invitationId: id } }),
    db.theme.findUnique({ where: { id: 'default' } })
  ])
  
  return { invitation, gallery, theme }
}

// ❌ 나쁜 예: 순차적 데이터 페칭
async function getInvitationDataBad(id: string) {
  const invitation = await db.invitation.findUnique({ where: { id } })
  const gallery = await db.galleryImage.findMany({ where: { invitationId: id } })
  const theme = await db.theme.findUnique({ where: { id: 'default' } })
  
  return { invitation, gallery, theme }
}
```

#### 스트리밍 SSR 최적화
```typescript
// app/[id]/page.tsx
import { Suspense } from 'react'
import { InvitationHeader } from '@/components/invitation/InvitationHeader'
import { InvitationGallery } from '@/components/invitation/InvitationGallery'
import { InvitationFooter } from '@/components/invitation/InvitationFooter'

export default async function InvitationPage({ params }: { params: { id: string } }) {
  const invitation = await getInvitation(params.id)
  
  return (
    <div>
      {/* 핵심 컨텐츠 즉시 렌더링 */}
      <InvitationHeader invitation={invitation} />
      
      {/* 이미지 갤러리 지연 로딩 */}
      <Suspense fallback={<GallerySkeleton />}>
        <InvitationGallery invitationId={params.id} />
      </Suspense>
      
      {/* 푸터는 마지막에 렌더링 */}
      <Suspense fallback={<FooterSkeleton />}>
        <InvitationFooter />
      </Suspense>
    </div>
  )
}
```

### 🔧 Client Components 최적화

#### React.memo와 useMemo 최적화
```typescript
// components/InvitationCard.tsx
import React, { memo, useMemo } from 'react'
import Image from 'next/image'

interface InvitationCardProps {
  invitation: {
    id: string
    title: string
    brideName: string
    groomName: string
    imageUrl: string
    date: string
  }
  onUpdate: (id: string) => void
}

export const InvitationCard = memo(({ invitation, onUpdate }: InvitationCardProps) => {
  // 복잡한 계산은 useMemo로 캐싱
  const formattedDate = useMemo(() => {
    return new Date(invitation.date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [invitation.date])
  
  const handleClick = useCallback(() => {
    onUpdate(invitation.id)
  }, [invitation.id, onUpdate])
  
  return (
    <div className="invitation-card">
      <Image
        src={invitation.imageUrl}
        alt={invitation.title}
        width={400}
        height={300}
        priority={invitation.id === 'featured'}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
      />
      <h3>{invitation.title}</h3>
      <p>{invitation.brideName} & {invitation.groomName}</p>
      <time>{formattedDate}</time>
      <button onClick={handleClick}>수정</button>
    </div>
  )
})

InvitationCard.displayName = 'InvitationCard'
```

#### Virtual Scrolling for Large Lists
```typescript
// components/VirtualGallery.tsx
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

interface VirtualGalleryProps {
  images: Array<{
    id: string
    url: string
    title: string
  }>
  onImageClick: (id: string) => void
}

export function VirtualGallery({ images, onImageClick }: VirtualGalleryProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <Image
        src={images[index].url}
        alt={images[index].title}
        width={300}
        height={200}
        onClick={() => onImageClick(images[index].id)}
        className="cursor-pointer transition-transform hover:scale-105"
      />
    </div>
  )
  
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          width={width}
          itemCount={images.length}
          itemSize={220}
          itemData={images}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  )
}
```

---

## 3. 이미지 및 에셋 최적화

### 🖼️ Next.js Image 최적화

#### 이미지 포맷 전략
```typescript
// next.config.js
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // 최신 포맷 우선
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

// 이미지 최적화 유틸리티
import Image, { ImageProps } from 'next/image'
import { getPlaiceholder } from 'plaiceholder'

export async function getOptimizedImageProps(src: string, alt: string): Promise<ImageProps> {
  try {
    // 이미지 메타데이터 및 플레이스홀더 생성
    const buffer = await fetch(src).then(res => res.arrayBuffer())
    const { base64, img } = await getPlaiceholder(Buffer.from(buffer))
    
    return {
      src,
      alt,
      width: img.width,
      height: img.height,
      placeholder: 'blur',
      blurDataURL: base64,
      loading: 'lazy',
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    }
  } catch (error) {
    console.error('Image optimization failed:', error)
    return {
      src,
      alt,
      width: 400,
      height: 300,
      placeholder: 'empty'
    }
  }
}
```

#### 이미지 프리로딩 전략
```typescript
// components/OptimizedGallery.tsx
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function OptimizedGallery({ images }: { images: string[] }) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  
  // 인터섹션 옵저버로 뷰포트 진입 시 로딩
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const imageIndex = parseInt(entry.target.getAttribute('data-index')!)
            setLoadedImages(prev => new Set([...prev, imageIndex]))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    
    document.querySelectorAll('[data-lazy-image]').forEach(el => {
      observer.observe(el)
    })
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div className="gallery-grid">
      {images.map((src, index) => (
        <div
          key={index}
          data-index={index}
          data-lazy-image
          className="gallery-item"
        >
          {loadedImages.has(index) ? (
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              width={400}
              height={300}
              className="fade-in"
              priority={index < 4} // 첫 4개 이미지만 우선 로딩
            />
          ) : (
            <div className="image-skeleton" />
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## 4. 번들 최적화

### 📦 코드 분할 전략

#### 다이나믹 임포트
```typescript
// 페이지 레벨 코드 분할
import dynamic from 'next/dynamic'

// 무거운 컴포넌트 지연 로딩
const DynamicCalendar = dynamic(
  () => import('@/components/ui/Calendar'),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false // 클라이언트 사이드에서만 렌더링
  }
)

const DynamicMap = dynamic(
  () => import('@/components/maps/InteractiveMap'),
  {
    loading: () => <MapSkeleton />,
    ssr: false
  }
)

// 조건부 로딩
function InvitationBuilder({ showAdvancedFeatures }: { showAdvancedFeatures: boolean }) {
  return (
    <div>
      <BasicEditor />
      
      {showAdvancedFeatures && (
        <Suspense fallback={<AdvancedLoading />}>
          <DynamicAdvancedEditor />
        </Suspense>
      )}
    </div>
  )
}

const DynamicAdvancedEditor = dynamic(
  () => import('@/components/builder/AdvancedEditor'),
  {
    loading: () => <AdvancedLoading />
  }
)
```

#### 번들 분석 및 최적화
```javascript
// next.config.js
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // 프로덕션 번들 최적화
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // 외부 라이브러리 분리
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10
            },
            // 공통 컴포넌트 분리
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              enforce: true
            },
            // UI 라이브러리 분리
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 15
            }
          }
        }
      }
    }
    return config
  }
}
```

#### Tree Shaking 최적화
```typescript
// ✅ 좋은 예: 필요한 모듈만 임포트
import { Button } from '@/components/ui/Button'
import { useState, useCallback } from 'react'

// ❌ 나쁜 예: 전체 라이브러리 임포트
import * as UI from '@/components/ui'
import React from 'react'

// 유틸리티 함수 트리 쉐이킹
// utils/index.ts
export { formatDate } from './dateUtils'
export { validateEmail } from './validation'
export { debounce } from './performanceUtils'

// 필요한 함수만 사용
import { formatDate, validateEmail } from '@/utils'
```

---

## 5. 캐싱 전략

### 🗄️ 다중 레벨 캐싱

#### 브라우저 캐싱
```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=30'
          }
        ]
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate'
          }
        ]
      }
    ]
  }
}
```

#### 서버 캐싱 (Redis)
```typescript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // 캐시 확인
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // 데이터 페칭
  const data = await fetcher()
  
  // 캐시 저장
  await redis.setex(key, ttl, JSON.stringify(data))
  
  return data
}

// 사용 예시
export async function getInvitation(id: string) {
  return getCachedData(
    `invitation:${id}`,
    () => db.invitation.findUnique({ where: { id } }),
    1800 // 30분
  )
}
```

#### CDN 캐싱 (Vercel Edge)
```typescript
// app/api/invitations/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const invitation = await getInvitation(params.id)
  
  return NextResponse.json(invitation, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      'CDN-Cache-Control': 'public, s-maxage=86400',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=86400'
    }
  })
}
```

---

## 6. 데이터베이스 성능 최적화

### 🗃️ 쿼리 최적화

#### 인덱스 최적화
```sql
-- invitations 테이블 인덱스
CREATE INDEX CONCURRENTLY idx_invitations_user_published 
ON invitations(user_id, published) 
WHERE published = true;

CREATE INDEX CONCURRENTLY idx_invitations_date_theme 
ON invitations(date, theme) 
WHERE published = true;

-- gallery_images 테이블 인덱스
CREATE INDEX CONCURRENTLY idx_gallery_images_invitation_order 
ON gallery_images(invitation_id, sort_order);

-- JSON 필드 인덱스
CREATE INDEX CONCURRENTLY idx_invitations_theme_gin 
ON invitations USING GIN (theme_settings);
```

#### 쿼리 성능 분석
```typescript
// lib/dbOptimization.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'minimal'
})

// N+1 문제 해결
export async function getInvitationsWithGallery(userId: string) {
  return prisma.invitation.findMany({
    where: { userId },
    include: {
      galleryImages: {
        select: {
          id: true,
          url: true,
          caption: true,
          sort_order: true
        },
        orderBy: {
          sort_order: 'asc'
        }
      },
      _count: {
        select: {
          galleryImages: true,
          guests: true
        }
      }
    },
    orderBy: {
      updated_at: 'desc'
    }
  })
}

// 페이지네이션 최적화
export async function getInvitationsPaginated(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit
  
  const [invitations, total] = await Promise.all([
    prisma.invitation.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { updated_at: 'desc' },
      select: {
        id: true,
        title: true,
        bride_name: true,
        groom_name: true,
        date: true,
        published: true,
        updated_at: true,
        _count: {
          select: {
            galleryImages: true
          }
        }
      }
    }),
    prisma.invitation.count({ where: { userId } })
  ])
  
  return {
    invitations,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}
```

---

## 7. 실시간 성능 모니터링

### 📊 Web Vitals 트래킹

#### Core Web Vitals 측정
```typescript
// lib/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Vercel Analytics로 전송
  if (window.va) {
    window.va('track', metric)
  }
  
  // 커스텀 분석 서비스로 전송
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metric: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      navigationType: performance.navigation.type,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })
  })
  
  // 성능 저하 알림
  if (
    (metric.name === 'LCP' && metric.value > 2500) ||
    (metric.name === 'FID' && metric.value > 100) ||
    (metric.name === 'CLS' && metric.value > 0.1)
  ) {
    console.warn(`Performance issue detected: ${metric.name} = ${metric.value}`)
  }
}

// Web Vitals 측정 시작
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

#### 커스텀 성능 메트릭
```typescript
// lib/customMetrics.ts
export function measureComponentRender(componentName: string) {
  return function <T extends React.ComponentType<any>>(Component: T): T {
    const WrappedComponent = (props: any) => {
      const startTime = React.useRef<number>()
      
      React.useEffect(() => {
        startTime.current = performance.now()
        
        return () => {
          if (startTime.current) {
            const renderTime = performance.now() - startTime.current
            
            // 렌더링 시간 기록
            window.gtag?.('event', 'component_render_time', {
              component_name: componentName,
              render_time: Math.round(renderTime),
              custom_parameter_1: window.location.pathname
            })
          }
        }
      })
      
      return <Component {...props} />
    }
    
    return WrappedComponent as T
  }
}

// 사용 예시
export const OptimizedInvitationCard = measureComponentRender('InvitationCard')(InvitationCard)
```

### 📈 대시보드 및 알림

#### 성능 대시보드
```typescript
// app/api/analytics/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  
  // 성능 데이터 저장
  await prisma.performanceMetric.create({
    data: {
      metric: body.metric,
      value: body.value,
      url: body.url,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date()
    }
  })
  
  return NextResponse.json({ success: true })
}

export async function GET() {
  // 최근 24시간 성능 통계
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  const metrics = await prisma.performanceMetric.groupBy({
    by: ['metric'],
    where: {
      timestamp: { gte: yesterday }
    },
    _avg: {
      value: true
    },
    _count: {
      id: true
    }
  })
  
  return NextResponse.json(metrics)
}
```

#### 성능 저하 알림
```typescript
// lib/performanceAlerts.ts
export async function checkPerformanceHealth() {
  const metrics = await fetchPerformanceMetrics()
  
  const alerts = []
  
  for (const metric of metrics) {
    const threshold = PERFORMANCE_THRESHOLDS[metric.name]
    
    if (metric.avgValue > threshold) {
      alerts.push({
        type: 'performance_degradation',
        metric: metric.name,
        value: metric.avgValue,
        threshold,
        severity: metric.avgValue > threshold * 1.5 ? 'critical' : 'warning'
      })
    }
  }
  
  if (alerts.length > 0) {
    await sendSlackAlert(`🚨 Performance Issues Detected:\n${alerts.map(alert => 
      `- ${alert.metric}: ${alert.value.toFixed(2)} (threshold: ${alert.threshold})`
    ).join('\n')}`)
  }
  
  return alerts
}

const PERFORMANCE_THRESHOLDS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  FCP: 1800,
  TTFB: 800
}
```

---

## 8. 모바일 성능 최적화

### 📱 모바일 특화 최적화

#### 터치 성능 최적화
```css
/* styles/mobile-performance.scss */
.touch-optimized {
  /* 터치 타겟 최소 크기 (44px) */
  min-height: 44px;
  min-width: 44px;
  
  /* 터치 지연 시간 감소 */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  
  /* 부드러운 터치 애니메이션 */
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.touch-optimized:active {
  transform: scale(0.95);
}

/* 스크롤 성능 최적화 */
.smooth-scroll {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  will-change: scroll-position;
}

/* 모바일 이미지 최적화 */
.responsive-image {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  content-visibility: auto;
  contain-intrinsic-size: 300px 200px;
}
```

#### 모바일 네트워크 최적화
```typescript
// lib/mobileOptimization.ts
export function isSlowNetwork(): boolean {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection
  
  if (!connection) return false
  
  return (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true
  )
}

export function adaptiveLoading() {
  if (isSlowNetwork()) {
    // 저속 네트워크에서는 이미지 품질 낮춤
    document.documentElement.classList.add('low-bandwidth')
    
    // 자동 동영상 재생 중지
    const videos = document.querySelectorAll('video[autoplay]')
    videos.forEach(video => {
      video.pause()
      video.removeAttribute('autoplay')
    })
  }
}

// CSS 변수를 통한 적응형 로딩
if (isSlowNetwork()) {
  document.documentElement.style.setProperty('--image-quality', 'low')
  document.documentElement.style.setProperty('--animation-duration', '0s')
}
```

---

## 9. 성능 테스팅 및 벤치마킹

### 🧪 성능 테스트 자동화

#### Lighthouse CI 설정
```yaml
# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'https://bananawedding.com',
        'https://bananawedding.com/invitation/sample',
        'https://bananawedding.com/builder'
      ],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
```

#### 성능 벤치마킹 스크립트
```typescript
// scripts/performanceBenchmark.ts
import { chromium } from 'playwright'
import { lhr } from 'lighthouse'

async function runPerformanceBenchmark(urls: string[]) {
  const browser = await chromium.launch()
  const results = []
  
  for (const url of urls) {
    const page = await browser.newPage()
    
    // Core Web Vitals 측정
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {
          fcp: 0,
          lcp: 0,
          cls: 0,
          fid: 0
        }
        
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'paint') {
              if (entry.name === 'first-contentful-paint') {
                metrics.fcp = entry.startTime
              }
            } else if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime
            } else if (entry.entryType === 'layout-shift') {
              if (!entry.hadRecentInput) {
                metrics.cls += entry.value
              }
            } else if (entry.entryType === 'first-input') {
              metrics.fid = entry.processingStart - entry.startTime
            }
          })
          
          if (metrics.fcp && metrics.lcp && metrics.cls && metrics.fid) {
            resolve(metrics)
            observer.disconnect()
          }
        })
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] })
      })
    })
    
    results.push({ url, metrics })
    await page.close()
  }
  
  await browser.close()
  return results
}
```

---

## 10. 성능 문제 디버깅

### 🔍 성능 병목 지원

#### 렌더링 성능 분석
```typescript
// lib/performanceProfiler.ts
export class PerformanceProfiler {
  private static marks = new Map<string, number>()
  
  static mark(name: string) {
    this.marks.set(name, performance.now())
  }
  
  static measure(name: string, startMark: string, endMark?: string) {
    const startTime = this.marks.get(startMark)
    if (!startTime) {
      console.warn(`Mark ${startMark} not found`)
      return
    }
    
    const endTime = endMark ? this.marks.get(endMark) : performance.now()
    const duration = endTime - startTime
    
    console.log(`${name}: ${duration.toFixed(2)}ms`)
    
    // 성능 저하 기록
    if (duration > 100) {
      window.gtag?.('event', 'performance_issue', {
        metric_name: name,
        duration: Math.round(duration),
        threshold: 100
      })
    }
    
    return duration
  }
}

// 사용 예시
PerformanceProfiler.mark('component-start')
// 컴포넌트 로직...
PerformanceProfiler.measure('Component Render', 'component-start')
```

#### 메모리 누수 탐지
```typescript
// lib/memoryProfiler.ts
export function checkMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    
    const memoryUsage = {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    }
    
    // 메모리 사용량 알림
    if (memoryUsage.used > memoryUsage.limit * 0.8) {
      console.warn('High memory usage detected:', memoryUsage)
      
      window.gtag?.('event', 'memory_warning', {
        used_memory: memoryUsage.used,
        limit_memory: memoryUsage.limit
      })
    }
    
    return memoryUsage
  }
}

// 주기적 메모리 체크
setInterval(checkMemoryUsage, 30000) // 30초마다
```

---

## 11. 성능 최적화 체크리스트

### ✅日常 성능 점검

#### 개발 시 확인 사항
- [ ] 이미지 최적화 (WebP, AVIF, lazy loading)
- [ ] 불필요한 리렌더링 제거 (React.memo, useMemo, useCallback)
- [ ] 대용량 리스트에 virtual scrolling 적용
- [ ] 번들 사이즈 분석 및 최적화
- [ ] API 응답 시간 최적화 (캐싱, 쿼리 최적화)

#### 배포 전 확인 사항
- [ ] Lighthouse 성능 점수 90점 이상
- [ ] Core Web Vitals 모든 지표 목표치 도달
- [ ] 모바일 환경 성능 검증
- [ ] 느린 네트워크 환경 테스트
- [ ] 메모리 누수 검증

### 📊 주간 성능 분석

#### 성능 메트릭 리뷰
- [ ] Core Web Vitals 트렌드 분석
- [ ] 사용자 경험 지표 모니터링
- [ ] API 응답 시간 분석
- [ ] 데이터베이스 쿼리 성능 검토
- [ ] 번들 사이즈 변화 추적

#### 개선 계획 수립
- [ ] 성능 저하 원인 분석
- [ ] 최적화 대책 우선순위 결정
- [ ] 성능 목표 재설정
- [ ] 개선 일정 계획

---

## 12. 성능 최적화 모범 사례

### 🎯 실제 적용 사례

#### 이미지 갤러리 최적화
```typescript
// 최적화 전: 모든 이미지 즉시 로딩
function GalleryBefore({ images }: { images: string[] }) {
  return (
    <div>
      {images.map(src => (
        <img key={src} src={src} alt="" />
      ))}
    </div>
  )
}

// 최적화 후: 지연 로딩 + virtual scrolling
function GalleryAfter({ images }: { images: string[] }) {
  return (
    <VirtualGallery images={images} />
  )
}

// 성능 개선 결과:
// - 초기 로딩 시간: 3.2s → 0.8s (-75%)
// - 번들 사이즈: 2.1MB → 1.3MB (-38%)
// - LCP: 4.1s → 1.9s (-54%)
```

#### 검색 기능 최적화
```typescript
// 최적화 전: 모든 데이터 로드 후 필터링
function SearchBefore() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/invitations/all') // 대용량 데이터
      .then(res => res.json())
      .then(data => {
        setResults(data.filter(/* 필터링 */))
        setLoading(false)
      })
  }, [])
  
  return <SearchResults results={results} loading={loading} />
}

// 최적화 후: 서버 사이드 필터링 + 디바운싱
function SearchAfter() {
  const [results, setResults] = useState([])
  const debouncedSearch = useMemo(
    () => debounce(async (query: string) => {
      const data = await fetch(`/api/invitations/search?q=${encodeURIComponent(query)}`)
      setResults(data)
    }, 300),
    []
  )
  
  return <SearchInput onSearch={debouncedSearch} results={results} />
}

// 성능 개선 결과:
// - 초기 로딩: 2.8s → 0.3s (-89%)
// - 검색 응답: 800ms → 120ms (-85%)
// - API 트래픽: 15MB → 200KB (-99%)
```

---

> **성능 최적화는 일회성 작업이 아니라 지속적인 과정입니다.** 정기적인 모니터링, 분석, 그리고 개선을 통해 사용자에게 최고의 경험을 제공해야 합니다. 성능 문제가 발견되면 즉시 분석하고 개선하는 문화를 만들어가야 합니다.