import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs"; // Note: bcryptjs is slower but pure JS, bcrypt needs native build. Using bcryptjs for ease.
import { db } from "@/db";
import { accounts, sessions, users, verificationTokens } from "@/db/schema";

// Separate schema for login validation
const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }) as Adapter,
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
                    columns: { id: true, email: true, name: true, passwordHash: true },
                });
                if (!user?.passwordHash) return null;
                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;
                return { id: user.id, email: user.email!, name: user.name ?? null } as any;
            },
        }),
    ],
    callbacks: {
        session: async ({ session, user }) => {
            // Fetch the role from the database
            const dbUser = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.id, user.id),
                columns: { role: true }
            });

            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                    role: dbUser?.role || "user",
                },
            };
        },
    },
});
