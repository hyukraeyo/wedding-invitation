# 🍌 바나나웨딩 (Banana Wedding)

> 특별한 순간을 위한 가장 달콤한 모바일 청첩장 제작 플랫폼

## 문서 동기화 규칙

- 규칙/가이드 변경 시 아래 파일을 반드시 함께 업데이트합니다.
  - `.agent/rules/banana-wedding.md`
  - `.cursorrules`
  - `AGENTS.md`
  - `README.md`
  - `ARCHITECTURE.md`
  - `.opencode/AGENTS.md`
- 스킬 경로나 정의를 바꿀 때는 다음 경로도 함께 동기화합니다.
  - 기준(수정 금지): `.agent/skills/vercel-react-best-practices`
  - 미러: `.codex/skills/vercel-react-best-practices`, `.cursor/skills/vercel-react-best-practices`
  - 프로젝트 스킬: `.agents/skills/*/SKILL.md`
  - OpenCode 설정: `.opencode/oh-my-opencode.json`

## 기술 스택

- Framework: Next.js 16.1.x (App Router, Cache Components, View Transitions)
- Library: React 19.2.x
- Language: TypeScript 5 (strict)
- Styling: SCSS Modules (필수), Radix UI Primitives
- State: Zustand (client), TanStack Query (server)
- Backend: Supabase
- Deploy: Vercel

## 개발 명령어

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run type-check
npm run analyze
npm run clean
npm run check:launch
```

## 핵심 개발 규칙

- 모바일 퍼스트를 기본으로 설계합니다.
- 스타일은 SCSS Modules만 사용합니다. (Tailwind CSS 금지)
- UI primitive는 `src/components/ui`, 조합형 UI는 `src/components/common`에 둡니다.
- 스타일 값(색상/간격/폰트)은 `src/styles` 토큰을 검색해 사용하고 하드코딩하지 않습니다.
- 커밋 메시지는 한글 Conventional Commits 형식을 사용합니다.

## SEO/검색 등록 운영 규칙 (2026-02)

- 공개 페이지는 `title`, `description`, `canonical`, `openGraph`, `twitter`, `robots` 메타를 정의합니다.
- 사이트 인증 토큰은 `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION` 환경 변수로 관리합니다.
- 검색 리소스 경로를 유지합니다.
  - `/robots.txt` (`src/app/robots.ts`)
  - `/sitemap.xml` (`src/app/sitemap.ts`)
  - `/rss.xml` (`src/app/rss.xml/route.ts`)
- 인덱싱 제외 페이지는 `noindex`를 적용합니다. (예: 로그인/빌더/마이페이지 등 비공개 흐름)
- 구조화 데이터(JSON-LD)를 유지합니다.
  - 전역: `WebSite`, `SoftwareApplication`, `Organization`
  - 홈: `WebPage`, `FAQPage`
  - 문서 페이지: `BreadcrumbList` (`/brand-story`, `/privacy`, `/terms`)
- 배포 후 체크 순서를 고정합니다.
  1. Vercel 환경 변수(Production/Preview) 확인
  2. 재배포
  3. 메타 태그/robots/sitemap/rss 실서버 확인
  4. Google Search Console/Naver Search Advisor에 사이트맵 제출 및 수집 요청

## 보안 규칙

- `.env.local` 및 비밀키는 커밋/공유하지 않습니다.
- 비밀값이 외부에 노출되면 즉시 해당 키를 폐기하고 재발급합니다.

## 프로젝트 스킬

- `design-md`: Stitch 프로젝트 디자인 시스템 문서화
- `vercel-react-best-practices` (기준/수정 금지): `.agent/skills/vercel-react-best-practices`
- `seo-launch-ops`: 검색 등록/색인/메타/사이트맵 점검 및 운영 절차 (신규)

## 라이선스

© 2026 Banana Wedding. All rights reserved.
