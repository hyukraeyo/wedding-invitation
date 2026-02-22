# Home Advanced Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Further optimize the Home experience and SEO quality, then finalize with a Korean Conventional Commit.

**Architecture:** Keep existing structure and make focused improvements in three layers: mobile-first UX polish in Home UI, SEO metadata completeness for public pages, and operational verification on real deployment endpoints. Avoid broad refactors and preserve current component boundaries.

**Tech Stack:** Next.js App Router, React 19, TypeScript, SCSS Modules, Metadata API, RSS/robots/sitemap routes.

---

### Task 1: Mobile UX Fine Tuning for Home

**Files:**

- Modify: `src/app/(with-header)/HomeClient.tsx`
- Modify: `src/app/(with-header)/Home.module.scss`

**Step 1: Define behavior**

- Improve section anchor usability under fixed header.
- Remove inline style color hardcoding from theme cards.
- Keep mobile dock readable while preserving tap behavior.

**Step 2: Implement**

- Add `scrollMarginTop` behavior through SCSS section styles.
- Switch theme preview card colors from inline style to token-based SCSS modifier classes.
- Refine mobile dock spacing and pointer behavior.

**Step 3: Verify**

- Run: `npm run type-check`
- Run: `npm run lint`

### Task 2: SEO Metadata Completeness + Deployment Endpoint Validation

**Files:**

- Modify: `src/app/(with-header)/privacy/page.tsx`
- Modify: `src/app/(with-header)/terms/page.tsx`

**Step 1: Define metadata completion**

- Ensure public documents include `twitter` and `robots` alongside existing canonical and OG metadata.

**Step 2: Implement**

- Add `twitter` metadata blocks to both pages.
- Add explicit `robots` metadata blocks to both pages.

**Step 3: Validate (local + deployed URL)**

- Run: `npm run check:launch -- --strict-verification`
- Run: `Invoke-WebRequest` checks for `/`, `/robots.txt`, `/sitemap.xml`, `/rss.xml`

### Task 3: Final Verification and Commit

**Files:**

- Modify: `docs/plans/2026-02-12-home-advanced-optimization.md` (this file)

**Step 1: Full verification**

- Run: `npm run type-check`
- Run: `npm run lint`
- Run: `npm run build`

**Step 2: Commit**

- Stage changed files.
- Commit in Korean Conventional Commit format.
