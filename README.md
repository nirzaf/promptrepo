# PromptVault

![Node](https://img.shields.io/badge/Node-20+-339933?logo=node.js&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)

A Next.js 16 application for discovering, sharing, and collaborating on high-quality AI prompts.

## Table of Contents
- [Overview](#overview)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Deployment](#deployment)

## Overview
PromptVault is a community-driven platform to browse, rate, and share prompts across categories with strong dark mode support, performant UI, and a scalable MySQL backend.

## Documentation
- [Project Documentation Guide](docs/PROJECT-GUIDE.md)
- [Master Index](docs/MASTER-INDEX.md)
- Archived Sources: [Original Overview](docs/_archived_sources/CLAUDE.MD), [Original Architecture Plan](docs/_archived_sources/requirements.md)

## Tech Stack
- Next.js `^16.0.4` (App Router + Turbopack)
- React `^19.x`
- TypeScript `^5.x`
- Tailwind CSS `^4.x`
- Drizzle ORM with MySQL 8.0
- Auth.js v5 (NextAuth)
- Radix UI + shadcn/ui components

## Getting Started
1. Install dependencies:
   ```bash
   yarn
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env` and fill in required values
   - Variables validated via `src/env.ts`
3. Start development server:
   ```bash
   yarn dev
   ```
   App runs at `http://localhost:3000` (or the next available port)

## Project Structure
- Application code: `src/app`, components in `src/components`, database in `src/db`
- Documentation: `docs/` (see Master Index)
- Static assets: `public/`
- Sample content: `SamplePrompts/`

## Scripts
```bash
yarn dev       # Start dev server (Turbopack)
yarn build     # Production build
yarn start     # Start production server
yarn lint      # Biome lint
yarn lint:fix  # Biome fix

# Database (Drizzle)
yarn db:generate
yarn db:migrate
yarn db:push
yarn db:studio
```

## Deployment
Refer to Next.js deployment documentation and your chosen hosting provider (e.g., Vercel). Ensure environment variables are set in production.
