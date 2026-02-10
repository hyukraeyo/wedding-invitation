# SEO Launch Checklist

## 1) Environment

- `GOOGLE_SITE_VERIFICATION` 값 존재
- `NAVER_SITE_VERIFICATION` 값 존재
- `NEXT_PUBLIC_BASE_URL`가 배포 URL과 일치

## 2) Code

- 공개 페이지 메타데이터 정의
- 비공개 페이지 `noindex` 적용
- `src/app/robots.ts` 유지
- `src/app/sitemap.ts` 유지
- `src/app/rss.xml/route.ts` 유지
- JSON-LD 유지

## 3) Build

```bash
npm run check:launch -- --strict-verification
npm run lint
npm run type-check
npm run build
```

## 4) Deployed URL

- `https://banana-wedding.vercel.app/robots.txt` 확인
- `https://banana-wedding.vercel.app/sitemap.xml` 확인
- `https://banana-wedding.vercel.app/rss.xml` 확인
- HTML 소스에서 `google-site-verification` 확인
- HTML 소스에서 `naver-site-verification` 확인

## 5) Console

- Google Search Console: sitemap 제출 + URL 검사/수집 요청
- Naver Search Advisor: 사이트맵 제출 + 웹페이지 수집 요청
