# Home Sequential Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve Home page UX and SEO in the order requested: mobile dock, landing copy/CTA text, then indexing metadata/endpoints.

**Architecture:** Keep existing route/component structure and update only Home-level presentation and SEO metadata files. Reuse existing `BottomCTA` behavior (`hideOnScroll`, `animated`) instead of editing shared UI primitives. Align search signals by fixing canonical metadata language and removing non-existent URLs from crawl surfaces.

**Tech Stack:** Next.js App Router, React 19, TypeScript, SCSS Modules, Metadata API (`robots.ts`, `sitemap.ts`), RSS route handler.

---

### Task 1: Improve Mobile Dock UX on Home

**Files:**

- Modify: `src/app/(with-header)/HomeClient.tsx`
- Modify: `src/app/(with-header)/Home.module.scss`

**Step 1: Define expected behavior**

- Mobile only, fixed CTA remains.
- CTA animates in and hides while scrolling down.
- Bottom spacing accounts for safe-area overlap risk.

**Step 2: Implement minimal changes**

- Enable `animated` and `hideOnScroll` props on `BottomCTA.Single`.
- Improve `.mobileDock` styling for legibility and touch area.
- Update container bottom padding to include safe-area inset.

**Step 3: Verify**

- Run: `npm run type-check`
- Run: `npm run lint`

### Task 2: Improve Home Landing Copy and Button Labels

**Files:**

- Modify: `src/app/(with-header)/HomeClient.tsx`

**Step 1: Define copy goals**

- Clear value proposition above the fold.
- Actionable CTA labels.
- Consistent Korean tone across sections.

**Step 2: Implement copy updates**

- Update hero title/description/chip.
- Update feature/workflow/FAQ text constants.
- Update footer link labels and mobile dock CTA label.

**Step 3: Verify**

- Run: `npm run type-check`
- Run: `npm run lint`

### Task 3: Improve SEO Metadata and Crawl Endpoints

**Files:**

- Modify: `src/app/(with-header)/page.tsx`
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/rss.xml/route.ts`

**Step 1: Define SEO adjustments**

- Keep required public metadata fields coherent for Home.
- Ensure robots disallow list includes private setup/auth flows.
- Remove non-existent route (`/brand-story`) from sitemap/rss.

**Step 2: Implement minimal changes**

- Refresh Home metadata strings and JSON-LD text.
- Add `/login` and `/setup` to `DISALLOW_PATHS`.
- Remove `/brand-story` entries from sitemap and RSS seed items.

**Step 3: Verify**

- Run: `npm run type-check`
- Run: `npm run lint`
- Run: `npm run build`
