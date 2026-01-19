# 🍌 바나나웨딩 (Banana Wedding) 💍

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![SCSS](https://img.shields.io/badge/Sass-1.69+-CC6699?style=flat-square&logo=sass)
![Radix UI](https://img.shields.io/badge/Radix%20UI-Primitives-black?style=flat-square&logo=radix-ui)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

유통기한 없는 달콤한 시작, 바나나웨딩입니다. Next.js 16의 최신 기능을 활용하여 최고의 성능과 감각적인 사용자 경험을 제공하는 모바일 청첩장 제작 플랫폼입니다.

## ✨ 주요 특징

### 🎨 디자인 및 사용자 경험

- 🚀 **Next.js 16 App Router** - 서버 컴포넌트 우선 아키텍처로 최고의 성능
- 📱 **모바일 퍼스트 디자인** - iPhone 15 Pro 목업으로 실시간 미리보기
- 🎨 **실시간 커스터마이징** - 직관적인 UI로 즉시 디자인 변경 가능
- 🔄 **완벽한 반응형** - 데스크톱, 태블릿, 모바일 모두 최적화
- 🎭 **계절별 테마 효과** - 벚꽃, 눈, 잎사귀, 개나리 등 다이나믹 애니메이션

### 🛠️ 기능 및 기술

- 🗺️ **듀얼 지도 시스템** - 카카오맵과 네이버 지도 동시 지원
- 📸 **다중 갤러리 뷰** - 스와이프, 썸네일, 그리드 뷰 유연한 선택
- 💰 **스마트 계좌 관리** - 신랑/신부 측 계좌번호 체계적 분류
- 📤 **소셜 공유 최적화** - 카카오톡 공유 썸네일 및 메시지 커스터마이징
- 🎯 **SEO 최적화** - 메타 태그, JSON-LD, 사이트맵 자동 생성

### ⚡ 성능 및 품질

- 🏃‍♂️ **초고속 로딩** - 서버 사이드 렌더링과 최적화된 번들
- 🔒 **TypeScript 엄격 모드** - 완벽한 타입 안전성과 개발 경험
- 📊 **성능 모니터링** - Core Web Vitals 기반 최적화
- 🎯 **접근성 준수** - WCAG 2.1 가이드라인 준수

## 🎨 디자인 시스템

### TDS Mobile 기반 커스텀 디자인 시스템

이 프로젝트는 **[TDS Mobile (Toss Design System)](https://tossmini-docs.toss.im/tds-mobile/)**을 참조하여 커스터마이징한 디자인 시스템을 사용합니다.

> TDS는 토스 제품을 만들 때 공통적으로 사용하는 디자인 시스템으로, 수백 개의 컴포넌트와 템플릿으로 구성되어 있습니다. 일관된 인터랙션, 애니메이션, 디자인 템플릿을 통해 제품 완성도를 업계 최고 수준으로 끌어올리는 것을 목표로 합니다.

#### 적용 영역

| 영역 | 파일 | 설명 |
|------|------|------|
| **Colors** | `_tds_colors.scss` | TDS 컬러 팔레트 기반 웨딩 테마 커스턴 |
| **Typography** | `_tds_typography.scss` | TDS 타이포그래피 시스템 적용 |
| **Components** | `components/builder/*` | TDS 스타일 가이드 준수 컴포넌트 |

#### 참조 문서

- [TDS 소개](https://tossmini-docs.toss.im/tds-mobile/) - 디자인 시스템 개요
- [TDS 시작하기](https://tossmini-docs.toss.im/tds-mobile/start/) - 빠른 시작 가이드
- [TDS Colors](https://tossmini-docs.toss.im/tds-mobile/foundation/colors/) - 컬러 시스템
- [TDS Typography](https://tossmini-docs.toss.im/tds-mobile/foundation/typography/) - 타이포그래피 시스템

---


## 🏗️ 아키텍처 및 개발 가이드

이 프로젝트는 일관된 개발 경험과 코드 품질을 위해 상세한 [아키텍처 가이드](./ARCHITECTURE.md)를 제공합니다. 모든 기여자는 개발 전 해당 문서를 필독해 주세요.

### 주요 내용

- **반응형 모달 시스템**: Desktop(Dialog) ↔ Mobile(Drawer) 자동 변환
- **아코디언 UI 패턴**: 아이콘 스타일 및 헤더 액션 구현 규칙
- **디자인 원칙**: Radix UI Primitives + SCSS Modules 시스템 구축
- **데이터 관리**: Zustand 상태 관리 및 성능 최적화 전략
- **Zustand Persist 패턴**: URL 기반 모드 구분으로 페이지 간 상태 초기화 관리
  - `/builder?mode=edit`: 기존 청첩장 수정 (상태 유지)
  - `/builder`: 새 청첩장 생성 (스토어 초기화)

---

## 🏗️ 기술 스택

### Core Framework & Language

- **Next.js 16.1.1** - App Router, 서버 컴포넌트, ISR/SSR 지원
- **React 19.2.3** - 새로운 컴파일러와 향상된 성능
- **TypeScript 5.0+** - 엄격 모드, 제네릭, 데코레이터 지원

### UI & Styling (최신 버전)

- **SCSS Modules** - BEM 방법론을 적용한 모듈 식 스타일링
- **Radix UI Primitives** - 웹 접근성 표준 준수 (Headless UI)
- **CSS Variables** - 다크모드 및 테마 확장을 위한 변수 관리

### State Management & Data

- **Zustand 5.0+** - TypeScript 지원과 미들웨어 생태계
- **TanStack Query** - 서버 상태 관리 (선택적 통합 가능)

### Maps & External Integrations

- **Kakao Maps SDK v1** - 실시간 위치 및 네비게이션
- **Naver Maps** - 고품질 지도 렌더링
- **Daum Postcode API** - 한국 주소 검색 최적화

### Rich Content & Media

- **Tiptap 3.15+** - 확장 가능한 리치 텍스트 에디터
- **html2canvas 1.4+** - 고해상도 캔버스 변환
- **jsPDF 4.0+** - PDF 생성 및 다운로드
- **Next.js Image** - WebP/AVIF 자동 변환 및 최적화

## 🚀 빠른 시작

### 📋 사전 요구사항

| 요구사항          | 버전                | 설명               |
| ----------------- | ------------------- | ------------------ |
| **Node.js**       | 18.17+              | LTS 버전 권장      |
| **패키지 매니저** | npm/yarn/pnpm/bun   | npm 9.0+ 권장      |
| **OS**            | Windows/macOS/Linux | 크로스 플랫폼 지원 |

### 📦 설치 및 설정

#### 1. 저장소 클론

```bash
git clone https://github.com/hyukraeyo/wedding-invitation.git
cd wedding-invitation
```

#### 2. 의존성 설치

```bash
# npm 사용 (권장)
npm install

# 또는 yarn 사용
yarn install

# 또는 pnpm 사용
pnpm install

# 또는 bun 사용 (최신)
bun install
```

#### 3. 환경 변수 설정 (선택사항)

```bash
# .env.local 파일 생성 (지도 API 키 등)
cp .env.example .env.local
```

### 🏃‍♂️ 개발 서버 실행

```bash
# npm 사용
npm run dev

# yarn 사용
yarn dev

# pnpm 사용
pnpm dev

# bun 사용
bun run dev
```

서버가 시작되면 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 🏗️ 빌드 및 배포

#### 프로덕션 빌드

```bash
# 타입 검사 및 빌드
npm run build

# 빌드 결과 확인
npm run start
```

#### 배포 준비 확인

```bash
# 모든 테스트 통과 확인
npm run lint
npm run build

# 번들 크기 분석 (선택)
npm run analyze
```

### 🗄️ Supabase 원격 마이그레이션

로컬 Docker 없이 **원격 Supabase 프로젝트에 직접** 마이그레이션을 적용합니다.

#### 1) 인증 토큰 준비

- Supabase Access Token을 발급한 뒤 환경 변수로 설정합니다.
- 비-인터랙티브 환경에서는 `npx supabase login` 대신 토큰을 사용하세요.

```bash
export SUPABASE_ACCESS_TOKEN=...
export SUPABASE_DB_PASSWORD=...
```

#### 2) 프로젝트 연결 및 마이그레이션 적용

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

#### 3) 데이터베이스 전체 삭제 (데이터 초기화)

기존 데이터를 모두 삭제하고 싶을 때 사용합니다. 모든 사용자와 청첩장 데이터가 영구 삭제됩니다.

```bash
npx supabase db push
```

이 명령어는 `supabase/migrations/` 디렉토리의 마이그레이션 파일 중, 모든 데이터를 삭제하는 마이그레이션을 포함합니다.

#### 참고

- `supabase/migrations`의 SQL이 원격 DB에 적용됩니다.
- 프로젝트 ref는 Supabase 대시보드 또는 `supabase/.temp/project-ref`에서 확인합니다.

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API 라우트 (미래 확장용)
│   ├── builder/                  # 청첩장 빌더 페이지
│   │   └── page.tsx
│   ├── globals.css               # 글로벌 스타일
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                  # 홈 페이지
│   ├── privacy/                  # 개인정보 처리방침
│   ├── robots.ts                 # 검색 엔진 크롤링 설정
│   └── sitemap.ts                # 사이트맵 생성
├── components/                   # 재사용 컴포넌트
│   ├── auth/                     # 인증 컴포넌트
│   ├── builder/                  # 빌더 관련 컴포넌트
│   │   ├── sections/            # 설정 섹션들
│   │   └── EditorForm.tsx       # 메인 에디터 폼
│   ├── common/                   # 공통 컴포넌트
│   └── preview/                  # 미리보기 컴포넌트
│       ├── sections/            # 미리보기 섹션들
│       └── InvitationCanvas.tsx # 메인 캔버스
├── lib/                         # 유틸리티 함수 (미래 확장)
├── store/                       # Zustand 상태 관리
│   └── useInvitationStore.ts    # 메인 상태 스토어
├── types/                       # TypeScript 타입 정의
│   ├── kakao.d.ts              # 카카오 API 타입
│   └── naver.d.ts              # 네이버 API 타입
└── constants/                  # 상수 정의 (미래 확장)
```

## ⚡ 성능 최적화 전략 (Next.js 16 + React 19)

### 🚀 App Router 아키텍처 최적화

#### 서버 컴포넌트 우선 전략 (Strict Mode)
- **Direct DB Access**: API Route 없이 서버 컴포넌트에서 DB 직접 조회
- **Server Actions**: 데이터 변이(Mutation)를 위한 서버 액션 적극 활용
- **Zero Client Fetching**: 초기 데이터 로딩 시 클라이언트 사이드 페칭 금지
- **스트리밍 UI**: `loading.tsx`와 `Suspense`로 점진적 콘텐츠 로딩

#### 캐싱 및 렌더링 전략

```typescript
// ISR (점진적 정적 재생성)
export const revalidate = 3600; // 1시간마다 재생성

// SSR (서버 사이드 렌더링)
export const dynamic = "force-dynamic";

// SSG (정적 생성)
export const dynamic = "force-static";
```

### 🖼️ 이미지 및 미디어 최적화

#### Next.js Image 컴포넌트 활용

- **자동 포맷 변환**: WebP/AVIF 지원으로 파일 크기 30% 감소
- **반응형 이미지**: 디바이스 픽셀 비율에 따른 자동 크기 조정
- **Lazy Loading**: Intersection Observer 기반 지연 로딩
- **Priority Loading**: LCP 이미지 우선 로딩

#### 고급 이미지 최적화

```typescript
<Image
  src="/hero.jpg"
  alt="웨딩 히어로 이미지"
  priority // LCP 최적화
  placeholder="blur" // 블러 플레이스홀더
  quality={90} // 품질 조정
/>
```

### 📦 번들 및 코드 최적화

#### 코드 분할 전략

- **동적 임포트**: `React.lazy()`와 `next/dynamic` 활용
- **라우트 기반 분할**: 페이지별 자동 코드 분할
- **컴포넌트 레벨 분할**: 무거운 컴포넌트 지연 로딩

#### 번들 분석 및 최적화

```bash
# 번들 크기 분석
npm run build --analyze

# Webpack Bundle Analyzer
ANALYZE=true npm run build
```

#### 메모이제이션 전략

- **React.memo**: props 변경 시에만 리렌더링
- **useMemo**: 계산 비용이 큰 값 캐싱
- **useCallback**: 이벤트 핸들러 함수 캐싱

## 🔧 개발 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm run start

# 린트 검사
npm run lint

# 타입 검사 (빌드 시 자동 수행)
npm run type-check
```

## 🌐 배포

### Vercel (권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hyukraeyo/wedding-invitation)

1. **Vercel 계정 생성**
2. **프로젝트 임포트**
3. **환경 변수 설정** (필요시)
4. **배포 완료**

### 수동 배포

```bash
# 빌드
npm run build

# 정적 파일 배포
# dist 폴더를 웹 서버에 업로드
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경 (포맷팅 등)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드/도구 설정 변경
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스로 배포됩니다.

## 👥 개발자

- **Hyuk Rae Yoon** - [GitHub](https://github.com/hyukraeyo)

## 🙏 감사 인사

- [Next.js](https://nextjs.org/) 팀
- [Vercel](https://vercel.com/) 플랫폼
- [Radix UI](https://www.radix-ui.com/) 팀
- 모든 오픈소스 기여자들

---

<div align="center">
  <p>🍌 바나나웨딩과 함께 행복한 시작을 �</p>
  <p>Made with ❤️ using Next.js 16</p>
</div>
