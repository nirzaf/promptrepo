import NextAuth from "next-auth";
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
    }),
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { email, password } = await signInSchema.parseAsync(credentials);

                // Logic to verify user against DB
                // This is a placeholder. You need to implement actual user lookup and password comparison.
                // For now, we return null to fail auth until implemented.
                return null;
            },
        }),
    ],
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
});
