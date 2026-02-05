# Design System: Banana Wedding Landing Page

**Project ID:** 18419277512798835740

## 1. Visual Theme & Atmosphere

The design embodies a **"Modern Minimalist Tech"** aesthetic, characterized by a clean, high-trust atmosphere suitable for a SaaS platform. It leverages a generous amount of whitespace (`background-light: #f5f7f8`) balanced with strong, bold typography (`Manrope`, `Noto Sans KR`) to create a professional yet approachable vibe. The interface feels "Airy" and "Digital-native," utilizing subtle depth (soft shadows) and smooth motion (hover lifts) to convey high quality and responsiveness. The primary Banana Yellow accent suggests reliability and clarity, while the overall layout prioritizes content legibility and mobile-responsiveness.

## 2. Color Palette & Roles

- **Banana Yellow (#FBC02D)**: The core brand color. Used for primary actions (CTAs), active states, and decorative accents.
- **Clean White (#ffffff)**: The primary background for cards and the header.
- **Soft Gray Background (#f5f7f8)**: A subtle off-white used for section backgrounds.
- **Deep Charcoal (#191f28)**: The primary text color (`text-main`).
- **Muted Slate (#8b95a1)**: Secondary text color (`text-sub`).
- **Dark Navy (#101722)**: Used for footers or high-contrast elements.

**Implementation Note:**
While Stitch generates Tailwind classes for visualization, the final implementation MUST use **SCSS Modules** without Tailwind, following the `AGENTS.md` rules.

## 3. Typography Rules

- **Font Family**: Primary usage of **Manrope** and **Noto Sans KR**.
- **Headings**: Bold to Black weights (`font-black`, `font-bold`). Headings often use `tracking-tight` for a modern, compact feel.
  - H1: Large, impactful (text-5xl to 7xl).
  - H2: Strong section titles (text-3xl to 4xl).
- **Body**: Clean and legible (`font-medium` or `font-normal`), typically in `text-lg` for readability.
- **Labels/Buttons**: Often `font-bold` to ensure call-to-actions are prominent.

## 4. Component Stylings

- **Buttons**:
  - **Primary**: **Pill-shaped** (`rounded-full`). Filled with **Banana Yellow**, white text (or dark text if contrast requires), and a decorative shadow. Includes interactive states.
  * **Secondary**: **Pill-shaped** (`rounded-full`). Filled with **Soft Gray Background**, dark text.
- **Cards/Containers**:
  - **Feature Cards**: **Generously rounded corners** (`rounded-2xl` i.e., 24px). White background with a subtle **Card Shadow** (`shadow-card`).
  - **Interaction**: Cards feature a "Lift" effect on hover (`hover:-translate-y-2`) combined with an intensified shadow (`hover:shadow-xl`), enhancing tactile feel.
- **Icons**:
  - Enclosed in **soft rounded squares** (`rounded-2xl`) or circles (`rounded-lg`).
  - Often use a tinted background (`bg-primary/10`) with the icon in the primary color.
- **Images**:
  - Portraits are circular (`rounded-full`) with a white ring border (`ring-2 ring-white`).
  - Content images use large border radius (`rounded-2xl`) for a friendly, modern look.

## 5. Layout Principles

- **Spacing**: Generous usage of padding (`py-24`, `px-6`). Sections are distinct and breathable.
- **Container**: Max-width constrained to `max-w-7xl` for large screens, centered (`mx-auto`).
- **Grid**: Responsive grid layouts (`grid-cols-1` to `grid-cols-3`) with substantial gaps (`gap-8`), ensuring content doesn't feel crowded.
- **Depth**: Usage of `z-index` and `backdrop-blur` in the sticky header implies a layered, glass-like interface depth.
