# PromptVault - AI Prompts Repository

## Project Overview

**PromptVault** is a Next.js 15 application for sharing and discovering AI prompts. It's a community-driven platform where users can browse, create, rate, and share prompts across different categories.

## Tech Stack

### Core

- **Framework**: Next.js 15 (App Router + Turbopack)
- **Language**: TypeScript 5.x (strict mode)
- **Database**: MySQL 8.0
- **ORM**: Drizzle ORM
- **Runtime**: Node.js

### Authentication & Security

- **Auth**: Auth.js v5 (NextAuth) with Drizzle adapter
- **Password Hashing**: bcryptjs
- **Guest Tracking**: Browser fingerprinting (@fingerprintjs/fingerprintjs)

### UI & Styling

- **Styling**: Tailwind CSS v4 with PostCSS
- **Components**: Radix UI primitives (Avatar, Dialog, Dropdown, Label, Select, Slot, Switch, Toast)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: class-variance-authority, clsx, tailwind-merge

### Data & State

- **Forms**: React Hook Form
- **Validation**: Zod
- **Caching**: Upstash Redis
- **Search**: @orama/orama (client-side search)

### File Management

- **Uploads**: UploadThing

### Email

- **Service**: Nodemailer

### Content Processing

- **Markdown**: marked, react-markdown, remark, remark-gfm, remark-html

### Development Tools

- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Git Hooks**: Husky + lint-staged
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Type Checking**: TypeScript 5.x
- **Build Tool**: Turbopack (via Next.js)
- **Environment**: T3 Env (@t3-oss/env-nextjs)

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── category/          # Category pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── explore/           # Explore page
│   │   ├── prompt/            # Individual prompt pages
│   │   └── ...
│   ├── actions/               # Server actions
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   ├── config/                # Configuration files
│   ├── db/                    # Database layer
│   │   ├── schema/           # Drizzle schema definitions
│   │   │   ├── categories.ts
│   │   │   ├── interactions.ts
│   │   │   ├── prompts.ts
│   │   │   └── users.ts
│   │   ├── queries/          # Database queries
│   │   └── index.ts          # Database client
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   └── env.ts                 # Environment validation
├── drizzle/                   # Database migrations
├── scripts/                   # Build/utility scripts
│   ├── ensure-prompts.mjs
│   └── import-sample-prompts.ts
├── public/                    # Static assets
├── SamplePrompts/            # Sample prompt data
└── requirements.md           # Detailed project requirements

```

## Database Schema

### Core Tables

- **users**: User accounts with authentication
- **prompts**: AI prompts with metadata, ratings, and categories
- **categories**: Prompt categories with descriptions
- **interactions**: User interactions (ratings, copies) including guest fingerprints

## Key Features

1. **Authentication**:
   - Email/password authentication via Auth.js
   - Session management with Drizzle adapter
   - Guest interactions via browser fingerprinting

2. **Prompt Management**:
   - Create, read, update prompts
   - Markdown support for prompt content
   - Category organization
   - Rating system (authenticated + guest)
   - Copy tracking

3. **Search & Discovery**:
   - Client-side search with Orama
   - Category browsing
   - Explore page for discovery
   - Full-text search capabilities

4. **UI/UX**:
   - Dark mode support with theme provider
   - Responsive design
   - Smooth animations via Framer Motion
   - Accessible components via Radix UI

## Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Check code with Biome
npm run lint:fix         # Fix code issues with Biome

# Database
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
npm run db:ensure-prompts    # Ensure sample prompts exist
npm run db:import-sample     # Import sample prompts
```

## Environment Variables

See `.env.example` for required environment variables. Key variables include:

- Database connection (MySQL)
- Auth.js configuration
- UploadThing keys
- Upstash Redis connection
- Other service API keys

Validated via T3 Env in `src/env.ts`.

## Development Workflow

1. **Setup**:
   ```bash
   npm install
   cp .env.example .env
   # Configure your .env file
   npm run db:push
   npm run db:import-sample
   ```

2. **Development**:
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```

3. **Database Changes**:
   - Update schema files in `src/db/schema/`
   - Run `npm run db:generate` to create migration
   - Run `npm run db:migrate` to apply migration
   - Or use `npm run db:push` for development

4. **Code Quality**:
   - Biome runs automatically on commit via Husky
   - Manual check: `npm run lint`
   - Auto-fix: `npm run lint:fix`

## Architecture Notes

### Design Philosophy

- **Performance-first**: Leverages Next.js 15 with Turbopack, React 19 Server Components
- **Type-safe**: Strict TypeScript, Zod validation, Drizzle ORM
- **Developer-friendly**: Biome for fast linting, clear project structure
- **Scalable**: MySQL 8.0, Redis caching, optimized queries

### Key Patterns

- Server Components for data fetching
- Server Actions for mutations
- Client Components for interactivity
- Edge-ready API routes
- Fingerprint-based guest tracking for anonymous interactions

## Recent Changes

Based on recent commits:

- Added `import-sample-prompts` script and `db:import-sample` command
- Refactored to use CSS variables for category page styling
- Implemented guest prompt rating via browser fingerprinting
- Enforced authentication for prompt creation
- Implemented dark mode styling with forced dynamic rendering for category/explore pages
- Removed Prisma dependencies (migrated to Drizzle)

## Additional Resources

- **Requirements**: See `requirements.md` for detailed architectural plan and feature specifications
- **Deployment**: Designed for Vercel deployment (seamless Next.js integration)
