# Project Documentation Guide

## Overview
PromptVault is a Next.js 16 application for discovering, sharing, and collaborating on AI prompts. It includes dark mode, performant UI, and a scalable MySQL backend with Drizzle ORM.

## Architecture
- Application: Next.js App Router with server components, Turbopack builds
- Data: MySQL 8.0 accessed via Drizzle ORM schemas and queries
- Auth: Auth.js v5 (NextAuth) using the Drizzle adapter
- Styling: Tailwind CSS v4 with CSS variables for light/dark theming
- Components: Radix UI primitives with shadcn/ui patterns

## Functional Components
- Prompt browsing and detail pages (`src/app/explore`, `src/app/prompt/[slug]`)
- Ratings, copies, and trending logic (`src/db/queries/prompts.ts`)
- Dashboard for creating and managing prompts (`src/app/dashboard/prompts`)
- Search API and client-side search utilities (`src/app/api/search`, `src/lib/search.ts`)

## Configuration
- Environment variables defined in `.env.example` and validated in `src/env.ts`
- Drizzle configuration: `drizzle.config.ts`, schemas under `src/db/schema/*`
- Tailwind and global theme tokens: `src/app/globals.css`
- Next.js configuration: `next.config.ts`

## Usage Patterns
- UI uses CSS variables and utility classes (`bg-card`, `text-foreground`) to ensure dark-mode readability
- Buttons and components leverage class-variance-authority for consistent variants
- Server-side data fetching via Next.js app routes and typed query functions

## Notable Examples
- Prompt card readability improvements in dark mode (`src/components/prompts/prompt-card.tsx`)
- Theme toggling managed by `src/components/theme-provider.tsx` and `theme-toggle.tsx`

## Source Traceability
This guide synthesizes and supersedes:
- Project Overview (`docs/CLAUDE.MD`)
- Architecture Plan (`docs/requirements.md`)

Original sources have been archived in `docs/_archived_sources/` for reference.
