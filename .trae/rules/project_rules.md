
# PromptVault — Coding Agent Guidelines

## Stack & Versions

| Tech | Version | Docs |
| :--- | :--- | :--- |
| **Framework** | | |
| Next.js | `16.0.5` | [https://nextjs.org/docs](https://nextjs.org/docs) |
| React | `19.2.0` | [https://react.dev/](https://react.dev/) |
| **Language** | | |
| TypeScript | `5.9.3` | [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/) |
| **Database** | | |
| Drizzle ORM | `0.38.4` | [https://orm.drizzle.team/docs/overview](https://orm.drizzle.team/docs/overview) |
| `mysql2` | `3.15.3` | [https://github.com/sidorares/node-mysql2](https://github.com/sidorares/node-mysql2) |
| **Authentication** | | |
| NextAuth.js | `5.0.0-beta.30`| [https://authjs.dev/](https://authjs.dev/) |
| **Styling** | | |
| Tailwind CSS | `4.1.17` | [https://tailwindcss.com/docs](https://tailwindcss.com/docs) |
| Radix UI | `~1.1.x` | [https://www.radix-ui.com/primitives/docs/overview/introduction](https://www.radix-ui.com/primitives/docs/overview/introduction) |
| `lucide-react` | `0.468.0` | [https://lucide.dev/guide/react](https://lucide.dev/guide/react) |
| **Linting/Formatting**| | |
| Biome | `1.9.4` | [https://biomejs.dev/](https://biomejs.dev/) |
| **Env Management**| | |
| T3 Env | `0.11.1` | [https://env.t3.gg/](https://env.t3.gg/) |

⚠️ **Version Warnings:**
*   **Next.js:** The project uses version `16.0.5`, which is an unstable, future release. Refer to its specific documentation and be aware of potential breaking changes.
*   **React:** The project uses React `19.2.0`, which may have different patterns from React 18 (e.g., `use` hook, Actions).
*   **NextAuth.js:** v5 is a significant departure from v4. All patterns must follow the new middleware and configuration standards.
*   **Tailwind CSS:** Version 4 is a major update. Do not use patterns from older versions.

---

### Pre-Task Checklist

- [ ] Verified versions in `package.json` and `yarn.lock` match the table above.
- [ ] Identified all affected files and their existing patterns (data fetching, state, styling).
- [ ] Checked official docs for the **exact versions** listed for any new syntax or APIs.
- [ ] Confirmed that environment variables are defined in `.env` and validated in `src/env.ts`.

---

### Architecture Rules

**Directory Structure:**

*   `src/app/`: **App Router Pages & API Routes**. Each folder represents a URL segment. `page.tsx` is the UI, `route.ts` is for API endpoints.
*   `src/actions/`: **Server Actions**. All backend mutations (create, update, delete) are defined here. They are invoked from Server and Client Components.
*   `src/components/`: **Shared React Components**.
    *   `src/components/ui/`: Primitives from `shadcn/ui` (e.g., `button.tsx`, `card.tsx`).
    *   `src/components/prompts/`: Domain-specific components (e.g., `prompt-card.tsx`).
*   `src/db/`: **Database Layer**.
    *   `src/db/schema/`: Drizzle ORM schemas defining tables and relations.
    *   `src/db/queries/`: Functions for querying the database. These are used by Server Components and Server Actions.
*   `src/lib/`: **Core Utilities & Config**.
    *   `src/lib/auth.ts`: NextAuth.js configuration.
    *   `src/lib/utils.ts`: General utility functions, including `cn` for Tailwind classes.
    *   `src/lib/env.ts`: T3 Env schema for environment variables.
*   `scripts/`: **Node.js scripts** for database seeding, migrations, etc. Run with `tsx`.

**Naming Conventions:**

*   **Files:** `kebab-case.ts` (e.g., `prompt-card.tsx`, `use-fingerprint.ts`). Exception: Next.js special files (`page.tsx`, `layout.tsx`).
*   **Components:** `PascalCase` (e.g., `PromptCard`).
*   **Functions/Variables:** `camelCase` (e.g., `getPublicPrompts`).
*   **Types/Interfaces:** `PascalCase`, often with a `Props` suffix for component props (e.g., `PromptCardProps`).

**Import Order & Path Aliases:**

*   **Path Alias:** Always use the `@/*` alias for absolute imports from the `src` directory.
    ```typescript
    import { cn } from '@/lib/utils';
    import { PromptCard } from '@/components/prompts/prompt-card';
    ```
*   **Order (General):**
    1.  React/Next.js imports
    2.  External library imports
    3.  Internal absolute imports (`@/`)
    4.  Relative imports (`./`, `../`)

---

### Code Patterns

#### ✓ CORRECT (Follow These):

```tsx
// Pattern: Data Fetching in Server Components
// Pages are async Server Components that fetch data directly.
import { getPublicPrompts } from "@/db/queries/prompts";

export default async function HomePage() {
  const prompts = await getPublicPrompts(12);
  // ... render prompts
}
```

```ts
// Pattern: Drizzle ORM Queries
// Queries are defined in `src/db/queries/*.ts` using Drizzle's fluent API.
import { db } from "@/db";
import { prompts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPromptBySlug(slug: string) {
    const result = await db
        .select(/*...*/)
        .from(prompts)
        .leftJoin(users, eq(prompts.userId, users.id))
        .where(eq(prompts.slug, slug))
        .limit(1);

    return result[0] || null;
}
```

```ts
// Pattern: Server Actions
// For mutations, use server actions defined with "use server";
// Validate inputs with Zod, perform DB operation, and revalidate/redirect.
"use server";
import { z } from "zod";
import { db } from "@/db";
import { prompts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const createPromptSchema = z.object({ /* ... */ });

export async function createPrompt(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }
    
    const validated = createPromptSchema.parse(Object.fromEntries(formData.entries()));
    // ... db insert
    
    revalidatePath("/");
    redirect(`/prompt/some-slug`);
}
```

#### ✗ WRONG (Never Do):

*   **No `useEffect` for data fetching:** Do not use `useEffect` with `fetch` in components. Data should be passed down from Server Components.
*   **No direct DB access in components:** Do not import `db` or query functions into client-side components. All data must come from page props or be fetched via Server Actions.
*   **Don't bypass env validation:** Always add new environment variables to `src/env.ts`.

---

### Technology-Specific Rules

**Next.js v16.0.5 (App Router):**
*   Utilize Server Components by default for data fetching and backend logic.
*   Use `"use client";` directive only when interactivity (hooks, event listeners) is essential.
*   Server Actions are the primary mechanism for data mutations.

**Drizzle ORM:**
*   Define all database schemas in `src/db/schema/`.
*   Group related queries in files within `src/db/queries/`.
*   Use Drizzle's relational queries (`.leftJoin()`) instead of multiple separate queries.

**Authentication (NextAuth.js v5):**
*   Access session data via the `auth()` helper from `@/lib/auth.ts` in Server Components and Server Actions.
*   All auth configuration is centralized in `src/lib/auth.ts`.
*   The `authorize` function in `Credentials` provider is currently a placeholder. Be cautious if implementing credentials auth.

**Styling:**
*   Use Tailwind CSS classes directly in `className`.
*   Use the `cn()` utility from `@/lib/utils.ts` to conditionally apply classes.
*   Build new UI elements from the primitives in `src/components/ui` whenever possible.

---

### Security | Performance | Accessibility

**Security:**
*   **Environment Variables:** All secrets are managed through `src/env.ts` and accessed via `env.VARIABLE_NAME`. Never hardcode secrets.
*   **Authentication:** Check for a valid session using `auth()` at the beginning of every Server Action that requires it.
*   **Input Validation:** Use `zod` to validate all user input in Server Actions before it's passed to the database.

**Performance:**
*   Use `Promise.all` to fetch data in parallel within Server Components.
*   Use `revalidatePath` in Server Actions to incrementally update the Next.js cache instead of full-page reloads.
*   Keep Client Component bundles small. Pass data down from Server Components instead of fetching on the client.

**Accessibility:**
*   Radix UI primitives are used, which provide a good accessibility foundation (keyboard navigation, ARIA attributes).
*   Ensure all interactive elements (`Button`, `Link`) have clear, descriptive text or `aria-label`s.

---

### Zero Regression Rules

**Critical Files (Extra Caution):**
*   `src/lib/auth.ts`: Any change can break authentication across the entire application.
*   `src/env.ts`: Modifying this can cause runtime errors if environment variables are not set correctly.
*   `src/db/schema/*`: Changes require a new database migration (`yarn db:generate`). Incorrect changes can lead to data loss.
*   `next.config.ts`: Can affect the entire application's build and runtime behavior.

**Never Break:**
*   The existing function signatures in `src/db/queries/`.
*   The API contracts of Server Actions in `src/actions/`. Changing an action's arguments or return value will break components that use it.
*   The authentication flow. Users must be able to log in and interact with protected routes/actions.

**After Mutations:**
*   Always call `revalidatePath()` or `revalidateTag()` in Server Actions to ensure stale data is not shown to the user.

---

### Testing Requirements

*   **Location:** While not present, new tests should be co-located with the source code (e.g. `src/components/prompts/prompt-card.test.tsx`).
*   **Naming:** Use `*.test.ts` or `*.test.tsx`.
*   **Pattern:** `vitest` is installed. Use it for unit and component testing. `playwright` is available for E2E tests.

---

### Quick Reference

**TL;DR Rules:**
1.  **Server First:** Fetch data and render on the server. Only use `"use client";` when absolutely necessary.
2.  **Mutate with Actions:** All database changes go through Server Actions in `src/actions/`.
3.  **Validate Everything:** Use `zod` in Server Actions to validate all incoming data.

**Common Mistakes to Avoid:**
*   Trying to use React hooks (`useState`, `useEffect`) in a Server Component (files that are not marked with `"use client";`).
*   Importing server-only code (like database queries) into a Client Component.
*   Forgetting to `revalidatePath` after a database mutation in a Server Action.

**When Uncertain:** → Check docs for the **LOCAL version** listed above → State uncertainty explicitly → **Match existing patterns in the codebase exactly.**
