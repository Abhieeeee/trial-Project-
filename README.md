<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1f6feb,100:58a6ff&height=160&section=header&text=trial-Project-&fontSize=36&fontColor=ffffff&fontAlignY=35&desc=Full-Stack%20Next.js%20Web%20Application&descSize=16&descAlignY=55&descColor=8b949e&animation=fadeIn" width="100%" />

</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

---

## 📋 Overview

A production-grade full-stack web application built with **Next.js 14+** and **TypeScript**, powered by **Supabase** for authentication, real-time data, and PostgreSQL database management. Features server-side rendering, API routes, and custom database triggers.

## 🏗️ Architecture

```
trial-Project-/
├── public/              # Static assets (images, fonts, icons)
├── src/                 # Application source code
│   ├── app/             # Next.js App Router pages & layouts
│   ├── components/      # Reusable React components
│   └── lib/             # Utility functions & Supabase client
├── supabase/            # Database migrations & seed files
│   └── migrations/      # PLpgSQL triggers & functions
├── create_users.js      # User seeding script
├── next.config.ts       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
├── eslint.config.mjs    # ESLint rules
├── postcss.config.mjs   # PostCSS / Tailwind configuration
└── package.json         # Dependencies & scripts
```

## ⚡ Key Features

- **Server-Side Rendering** — Optimized page loads with Next.js App Router
- **Type-Safe Codebase** — End-to-end TypeScript for reliability
- **Supabase Integration** — Auth, real-time subscriptions, and row-level security
- **Custom Database Logic** — PLpgSQL triggers and stored procedures
- **User Management** — Automated user creation and seeding scripts
- **Modern Styling** — PostCSS pipeline with utility-first CSS

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- **Supabase** account (or local Supabase CLI)

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhieeeee/trial-Project-.git
cd trial-Project-

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Database Setup

```bash
# Apply Supabase migrations
npx supabase db push

# Seed users (optional)
node create_users.js
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Backend** | Supabase (Auth, Database, Storage) |
| **Database** | PostgreSQL + PLpgSQL |
| **Styling** | PostCSS + Tailwind CSS |
| **Deployment** | Vercel |
| **Linting** | ESLint |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Abhieeeee">Abhi Mishra</a></sub>
</div>

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1f6feb,100:58a6ff&height=100&section=footer" width="100%" />
</div>
