import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { authConfig } from "./auth.config";

// Separate schema for login validation
const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    session: { strategy: "jwt" }, // Use JWT for credentials provider compatibility and edge middleware
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { email, password } = await signInSchema.parseAsync(credentials);
                const user = await db.query.users.findFirst({
                    where: (users, { eq }) => eq(users.email, email),
                    columns: { id: true, email: true, name: true, passwordHash: true, role: true },
                });
                if (!user?.passwordHash) return null;
                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;
                return {
                    id: user.id,
                    email: user.email!,
                    name: user.name ?? null,
                    role: (user.role ?? "user") as "user" | "moderator" | "admin",
                };
            },
        }),
    ],
});
