# TODO

## Launch Blocking

- [ ] Add Vercel environment variables.
- [ ] Set `GOOGLE_SITE_VERIFICATION`.
- [ ] Set `NAVER_SITE_VERIFICATION`.
- [ ] Apply values to both Production and Preview.
- [ ] Trigger redeploy.

## Post-Deploy Verification

- [ ] Confirm site verification meta tags are rendered in page source.
- [ ] Verify `https://wedding-invitation-zeta-one.vercel.app/robots.txt`.
- [ ] Verify `https://wedding-invitation-zeta-one.vercel.app/sitemap.xml`.

## OAuth Setup

- [ ] Register Kakao Redirect URI in console.
- [ ] Confirm `https://wedding-invitation-zeta-one.vercel.app/api/auth/callback/kakao`.
- [ ] Register Naver Redirect URI in console.
- [ ] Confirm `https://wedding-invitation-zeta-one.vercel.app/api/auth/callback/naver`.
- [ ] Run end-to-end Kakao login test.
- [ ] Run end-to-end Naver login test.

## Search Engine Submission

- [ ] Complete Google Search Console site verification.
- [ ] Complete Naver Search Advisor site verification.
- [ ] Submit sitemap to Google Search Console.
- [ ] Submit sitemap to Naver Search Advisor.

## Hardening

- [ ] Resolve existing 8 lint warnings.
- [ ] Add CI checks for `type-check`, `build`, and `check:launch`.
