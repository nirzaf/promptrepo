import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "user" | "moderator" | "admin";
        } & DefaultSession["user"];
    }

    interface User {
        role: "user" | "moderator" | "admin";
    }
}
