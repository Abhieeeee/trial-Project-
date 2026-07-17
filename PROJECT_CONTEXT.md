# AURA STREET — Project Context & Developer Reference

Use this document to quickly onboard any AI assistant (such as Gemini, Antigravity, or other code editors) to the current state of this project. Copy and paste this file (or upload it) as your first prompt in a new chat.

---

## 📂 1. Project Location & Stack
* **Local Path:** `C:\Users\DELL\.gemini\antigravity\scratch\aura-street`
* **Git Repository:** `https://github.com/Abhieeeee/trial-Project-`
* **Vercel Deploy:** Connects to GitHub for automated pushes to the `main` branch.
* **Core Technologies:**
  * **Framework:** Next.js 16.2.10 (Turbopack & App Router)
  * **Styling:** Tailwind CSS v4
  * **Database & Auth:** Supabase Auth + Postgres Database via `@supabase/ssr`
  * **Animations:** Framer Motion (v12) & GSAP
  * **Scroll:** Lenis Smooth Scroll

---

## 🔑 2. Active Test Credentials
These accounts have already been programmatically registered in the Supabase database:

| Portal | Email | Password | Redirect Path |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `super@aurastreet.com` | `SuperAdminSecure123!` | `/super-admin/dashboard` |
| **Admin** | `admin@aurastreet.com` | `AdminSecure123!` | `/admin/dashboard` |

*Default roles are mapped automatically from the `profiles` table inside the database.*

---

## 🔒 3. Authentication & Routing Architecture
* **Routing Guard (`src/proxy.ts`):** Next.js 16 Proxy convention intercepts all routes matching `/admin/:path*`, `/super-admin/:path*`, and `/user-dashboard/:path*`.
* **Security Checks:**
  1. Checks for active session cookie via client anon key.
  2. Bypasses client-side RLS using `SUPABASE_SERVICE_ROLE_KEY` inside the Edge-compatible `createServerClient` to securely query the user's role from the database.
  3. Automatically routes unauthorized roles to their allowed landing dashboards or back to `/admin/login`.

---

## 🎨 4. Key Design Patterns
* **Responsive Sci-Fi Login (`src/app/admin/login/page.tsx`):**
  * Built using **Orbitron** (Google Font) for tech elements, and **JetBrains Mono** for data fields.
  * Moving vector SVG HUD background with ambient glows.
  * Dynamically morphs colors based on selected role toggle (Staff = White, Admin = Sky Blue, Super Admin = Red).
  * Smooth Framer Motion sliding tab highlight.
* **Dashboard Layouts:**
  * Located in `/admin/layout.tsx`, `/super-admin/layout.tsx`, and `/user-dashboard/layout.tsx`.
  * Features semi-transparent backdrop blur (`backdrop-blur-2xl bg-black/70`) and role-based matching accent glows.
  * Includes a **"Store" back-link** in all sidebars pointing to the homepage.
* **Smart Custom Cursor (`src/components/CustomCursor.tsx`):**
  * Hides browser default cursor on storefront pages by adding `.custom-cursor-active` to `html`.
  * Automatically removes the class when unmounting to restore the standard mouse cursor on all admin/dashboard pages.

---

## 🛠️ 5. Common Commands (Windows Environment)
Due to local script execution policy restrictions on PowerShell, run commands using `cmd /c`:

* **Start Dev Server:**
  ```cmd
  cmd /c "npm run dev"
  ```
* **Build Project:**
  ```cmd
  cmd /c "npm run build"
  ```
* **Stage & Commit:**
  ```cmd
  git add .
  git commit -m "your message"
  git push
  ```
