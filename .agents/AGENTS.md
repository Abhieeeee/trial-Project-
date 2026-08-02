# 🧠 Workspace Rules & Memory: AURA STREET Project

## 🎨 UI/UX & Design System Standards
- **Brand Identity**: Preserve the AURA STREET luxury dark streetwear identity (cyberpunk/high-fashion aesthetic, 450GSM cotton specs, PBR materials, cyan accents `#00D2FF`).
- **Surface Elevation Scale**:
  - Base background: `#030305`
  - Card background: `#0a0a0e` (with `backdrop-blur-2xl bg-[#0a0a0e]/90 border border-white/10`)
  - Elevated glass containers: `.glass-panel-glow` with multi-layered drop shadows (`shadow-[0_20px_50px_rgba(0,0,0,0.95)]`).
- **Header & Page Clearances**:
  - `<Header />` is fixed (`fixed top-0 left-0 w-full z-40`).
  - `<PageShell />` MUST include top clearance padding `pt-[80px] md:pt-[100px]` to prevent Header overlap on subpages.
  - Page titles (`PageIntro`) MUST use responsive scaling (`text-2xl sm:text-4xl md:text-5xl font-black`) to prevent clipping.

## 💳 Form & Checkout Component Rules
- **Form Inputs (`UnderlineCheckoutInput`)**:
  - Always use floating glass input cards with labels (`bg-white/[0.03] border border-white/15 focus:border-[#00D2FF] rounded-xl px-4 py-3.5 text-xs text-white placeholder:text-neutral-500 font-mono`).
  - Never use raw invisible single-line text inputs on pure black backgrounds.
- **Gateway Selectors**:
  - Region tabs (Nepal vs. International) use rounded glass containers with active cyan/emerald glow rings (`ring-1 ring-white/20`).

## 🛍️ Product Catalog Cards
- **`StoreProductCard`**:
  - Uses glassmorphic image frames (`bg-[#0a0a0e] border border-white/10 group-hover:border-[#00D2FF]/40 rounded-2xl`).
  - Quick View and Add to Bag buttons feature rounded glass pill styling with `active:scale-95` tactile press feedback.

## 🚀 Deployment & Verification Procedures
- Always verify TypeScript compilation: `npx tsc --noEmit`
- Always verify Next.js build: `npm run build`
- Production target: `git push origin main` -> Vercel Production (`https://trial-project-bice.vercel.app`)
- **Always verify middleware exists:** Check that `src/middleware.ts` (or root `middleware.ts`) exists, exports a `middleware` function, and has a `config.matcher` covering all protected routes (`/admin/*`, `/super-admin/*`, `/user-dashboard/*`). A proxy file that is never imported is dead code.
- **Never use client-side Supabase for write operations on sensitive tables** (orders, payments, profiles). Always use Server Actions with `createAdminClient()` and recalculate totals server-side.

## ⚡ Mandatory Execution Workflows (Always Active)
- **GSD (Get Shit Done)**: Structure all tasks into explicit phases (Discuss & Align -> Plan & Decompose -> Autonomous Execution -> Nyquist Verification).
- **UI/UX Refinement Master Pipeline**:
  - *Spotlight Cursor Glow*: Wrap elevated cards/containers in `<SpotlightCard>` to render interactive mouse-following cyan radial illumination.
  - *Magic UI Border Beam*: Use `<BorderBeam>` on active product image frames to render rotating metallic beam highlights.
  - *Tactile Fabric Texture*: Apply `.bg-noise` to dark surfaces for 3% tactile noise overlay (mimics 450GSM heavy cotton texture).
  - *Spring Physics Micro-Interactions*: Use Framer Motion `type: "spring", stiffness: 400, damping: 25` with `whileHover={{ y: -4 }}` and `whileTap={{ scale: 0.95 }}` on all interactive triggers.
- **Continuous State Audit & Reporting**: After completing any task phase or major edit cycle:
  - Run `npx tsc --noEmit` to verify type safety.
  - Generate/update a structured walkthrough or audit report summarizing what was done.
  - Outline the next highest-impact, easy-to-implement UI/UX upgrade with clear rationale.
- **Ralph Loop**: Perform continuous test-fix-verify iterations autonomously until `npx tsc --noEmit` and `npm run build` succeed with 0 errors.
- **CodeRabbit AI Reviewer**: Perform automated line-by-line code reviews, diff impact analysis, anti-slop checks, and security scans on all new or modified code before final verification.



