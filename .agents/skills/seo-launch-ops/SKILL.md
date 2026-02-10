---
name: seo-launch-ops
description: Optimize and operate Banana Wedding SEO and search indexing across Google Search Console and Naver Search Advisor. Use when tasks involve 검색 노출, 색인 요청, 사이트 인증, sitemap/rss 제출, metadata/robots/sitemap/rss 점검, or SEO readiness checks.
---

# SEO Launch Ops

## Use This Workflow

1. 점검 범위를 확인합니다.
2. 코드 기준 SEO 신호를 점검합니다.
3. 배포 URL 기준 인덱싱 신호를 검증합니다.
4. 필요 변경을 최소 범위로 적용합니다.
5. `lint`, `type-check`, `build`를 실행해 안정성을 검증합니다.
6. TODO 및 운영 문서를 업데이트합니다.

## Project SEO Source Map

- 전역 메타/검증/구조화데이터: `src/app/layout.tsx`
- 홈 메타/FAQ 구조화데이터: `src/app/page.tsx`
- 브랜드/약관/개인정보 메타: `src/app/brand-story/page.tsx`, `src/app/(with-header)/terms/page.tsx`, `src/app/(with-header)/privacy/page.tsx`
- robots: `src/app/robots.ts`
- sitemap: `src/app/sitemap.ts`
- rss: `src/app/rss.xml/route.ts`
- 검증 HTML 파일: `public/google*.html`, `public/naver*.html`
- 런치 체크 스크립트: `scripts/check_launch_readiness.js`
- 운영 체크리스트: `TODO.md`

## Required SEO Rules

- 공개 페이지에 `title`, `description`, `canonical`, `openGraph`, `twitter`, `robots`를 유지합니다.
- 비공개/인증 플로우는 `noindex`를 유지합니다.
- `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION`은 환경 변수로만 관리합니다.
- `/robots.txt`, `/sitemap.xml`, `/rss.xml` 응답을 항상 유지합니다.
- 구조화 데이터(JSON-LD)는 전역/홈/문서형 페이지 규칙을 유지합니다.

## Validate Commands

```bash
npm run check:launch -- --strict-verification
npm run lint
npm run type-check
npm run build
```

PowerShell 배포 검증:

```powershell
Invoke-WebRequest -Uri "https://banana-wedding.vercel.app" -UseBasicParsing
Invoke-WebRequest -Uri "https://banana-wedding.vercel.app/robots.txt" -UseBasicParsing
Invoke-WebRequest -Uri "https://banana-wedding.vercel.app/sitemap.xml" -UseBasicParsing
Invoke-WebRequest -Uri "https://banana-wedding.vercel.app/rss.xml" -UseBasicParsing
```

## Console Operations (Manual)

- Google Search Console:
  - 속성 확인 완료
  - `/sitemap.xml` 제출
  - 핵심 URL 수집 요청 (`/`, `/brand-story`, `/privacy`, `/terms`)
- Naver Search Advisor:
  - 소유 확인 완료
  - 사이트맵 제출
  - 웹페이지 수집 요청

## Security Rules

- 비밀키를 대화/문서/커밋에 평문으로 남기지 않습니다.
- 노출된 비밀키는 즉시 폐기하고 재발급합니다.
