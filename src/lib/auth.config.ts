import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isOnAdmin) {
                // Note: Role check might not be available in edge middleware if it requires DB lookup
                // But if we put role in JWT, it should be available in auth.user
                if (isLoggedIn && (auth.user as any).role === 'admin') return true;
                return false;
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            if (session.user && token.role) {
                session.user.role = token.role as "user" | "admin" | "moderator";
            }
            return session;
        },
    },
    providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
