<!-- Copilot / AI agent instructions for contributors and automated coding agents -->
# Copilot Instructions — PromptVault

Purpose: make AI coding agents immediately productive in this repository by capturing the architecture, developer workflows, patterns, and concrete in-repo examples.

Quickstart (commands)
- **Install:** `yarn`
- **Dev server:** `yarn dev`  # starts Next.js with Turbopack (App Router)
- **Build:** `yarn build` and `yarn start`
- **DB (development):** `yarn db:push` then `yarn db:import-sample` or `yarn db:ensure-prompts`
- **Migrations:** `yarn db:generate` then `yarn db:migrate`
- **Lint:** `yarn lint` (Biome), **fix:** `yarn lint:fix`

Critical places to read first
- **App & routes:** `src/app/` (App Router pages and `src/app/api/*` for route handlers)
- **DB client & schema:** `src/db/index.ts` and `src/db/schema/*.ts` (Drizzle ORM)
- **Auth glue:** `src/lib/auth.ts` (NextAuth + Drizzle adapter)
- **Env validation:** `src/env.ts` (T3 Env – authoritative list of required env vars)
- **Scripts:** `scripts/` (import/seed helpers such as `scripts/import-sample-prompts.ts`)
- **Docs:** `docs/CLAUDE.MD` and `README.md` for project overview and developer notes

Big-picture architecture (short)
- Frontend & API: Next.js App Router (React Server Components where used) under `src/app/`.
- Database: MySQL 8 via Drizzle ORM. Connection established in `src/db/index.ts` and schema under `src/db/schema/`.
- Auth: `next-auth` (Auth.js v5) with Drizzle adapter implemented in `src/lib/auth.ts`. Routes call `auth()` to read session.
- Search & caching: client-side Orama for search; Upstash Redis used for caching where present.
- Uploads & 3rd-party integrations: `uploadthing` for uploads, `nodemailer` for email, `@fingerprintjs/fingerprintjs` used for guest tracking.

Project-specific conventions and actionable notes
- Environment: Always consult `src/env.ts` for required environment variables before running local tasks — this file is the source of truth.
- Database changes: Edit schema files in `src/db/schema/`. After changes, run `yarn db:generate` (drizzle-kit) then `yarn db:migrate` in CI/dev. For quick dev iteration use `yarn db:push`.
- API handlers: Follow Next.js route handler pattern — export `GET`, `POST`, etc., and return `NextResponse`. Example: `src/app/api/prompts/[id]/rate/route.ts`.
- Sessions: Use `auth()` from `src/lib/auth.ts` inside server handlers to get session; code often expects `session?.user?.id`.
- Guest interactions: The system records guest actions via fingerprinting — the `ratings` flow allows `guestFingerprint` alongside `userId` (see `src/app/api/prompts/[id]/rate/route.ts`).
- Password hashing: `bcryptjs` is used (pure JS) — keep using it unless native builds are acceptable.

Code patterns to follow (examples)
- Database client: `src/db/index.ts` exports `db` via `drizzle(mysqlPool, { schema, mode: 'default' })` — import and reuse `db` in server code.
- Schema & queries: keep schema definitions in `src/db/schema/*.ts` and higher-level queries in `src/db/queries/` (see `src/db/queries/prompts.ts`).
- Authentication provider: `src/lib/auth.ts` demonstrates a Credentials provider scaffold; real authorize logic should look up users via the Drizzle adapter and compare hashed passwords with `bcryptjs`.
- Rate flow example: `POST` to `src/app/api/prompts/[id]/rate/route.ts` validates rating, calls `auth()` for session, accepts `fingerprint` for guest users, inserts into `ratings` and updates prompt aggregates.

Testing & CI notes
- Unit tests: `vitest` is used for unit tests when present.
- E2E: Playwright is configured for end-to-end tests.
- Linting: Biome is used (`yarn lint`) and integrated via Husky + lint-staged on commit hooks.

When modifying files, be explicit
- If editing DB schemas, include the expected drizzle-kit commands in your PR description and run `yarn db:generate` locally to produce migrations.
- If changing public API routes or auth behavior, include an integration test or a Playwright scenario that covers the new behavior.

Commits & PR guidance for AI agents
- Keep changes small and focused. For schema changes, split into (1) schema + migration, (2) server changes, (3) frontend changes.
- Update `docs/` or `README.md` when adding new developer-visible workflows.

Files worth opening for context (examples)
- `src/db/index.ts` — DB client and connection (Drizzle)
- `src/lib/auth.ts` — Auth configuration and exported `auth()` helper
- `src/app/api/prompts/[id]/rate/route.ts` — concrete example of route handler, session + guest handling, and DB updates
- `package.json` — canonical scripts (dev, db:push, db:generate, db:migrate, lint)
- `src/env.ts` — precise environment variables and validation

If anything below is ambiguous, ask for the specific area to inspect (routes, schema, or scripts). After your first change, include a short PR checklist referencing the db and lint commands above.

---
Request for feedback: Is there any area you want documented more deeply (e.g., migrations, auth flows, or CI)? Reply with the section name to expand.
