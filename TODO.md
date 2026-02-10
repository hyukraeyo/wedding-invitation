# TODO

## Launch Blocking

- [ ] Add Vercel environment variables.
- [x] Set `GOOGLE_SITE_VERIFICATION`.
- [x] Set `NAVER_SITE_VERIFICATION`.
- [ ] Apply values to both Production and Preview.
- [ ] Trigger redeploy.

## Post-Deploy Verification

- [x] Confirm site verification meta tags are rendered in page source.
- [x] Verify `https://banana-wedding.vercel.app/robots.txt`.
- [x] Verify `https://banana-wedding.vercel.app/sitemap.xml`.

## OAuth Setup

- [ ] Register Kakao Redirect URI in console.
- [x] Confirm `https://banana-wedding.vercel.app/api/auth/callback/kakao`.
- [ ] Register Naver Redirect URI in console.
- [x] Confirm `https://banana-wedding.vercel.app/api/auth/callback/naver`.
- [ ] Run end-to-end Kakao login test.
- [ ] Run end-to-end Naver login test.

## Search Engine Submission

- [x] Complete Google Search Console site verification.
- [x] Complete Naver Search Advisor site verification.
- [x] Submit sitemap to Google Search Console.
- [ ] Submit sitemap to Naver Search Advisor.

## Hardening

- [x] Resolve existing 8 lint warnings.
- [x] Add CI checks for `type-check`, `build`, and `check:launch`.
