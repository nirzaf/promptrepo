import {
    boolean,
    index,
    int,
    mysqlEnum,
    mysqlTable,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable(
    "users",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        name: varchar("name", { length: 255 }),
        username: varchar("username", { length: 50 }).unique(),
        email: varchar("email", { length: 255 }).notNull(),
        emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
        image: varchar("image", { length: 255 }),
        role: mysqlEnum("role", ["user", "moderator", "admin"]).default("user"),
        isVerified: boolean("isVerified").default(false),
        reputationScore: int("reputationScore").default(0),
        bio: text("bio"),
        website: varchar("website", { length: 255 }),
        twitterHandle: varchar("twitterHandle", { length: 50 }),
        githubHandle: varchar("githubHandle", { length: 50 }),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
        updatedAt: timestamp("updatedAt").onUpdateNow(),
    },
    (table) => ({
        emailIdx: uniqueIndex("email_idx").on(table.email),
        usernameIdx: uniqueIndex("username_idx").on(table.username),
    })
);

export const accounts = mysqlTable(
    "accounts",
    {
        userId: varchar("userId", { length: 255 }).notNull(),
        type: varchar("type", { length: 255 }).notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: text("id_token"),
        session_state: varchar("session_state", { length: 255 }),
    },
    (table) => ({
        compoundKey: uniqueIndex("account_provider_id_idx").on(
            table.provider,
            table.providerAccountId
        ),
        userIdIdx: index("userId_idx").on(table.userId),
    })
);

export const sessions = mysqlTable(
    "sessions",
    {
        sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
        userId: varchar("userId", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (table) => ({
        userIdIdx: index("userId_idx").on(table.userId),
    })
);

export const verificationTokens = mysqlTable(
    "verificationToken",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (table) => ({
        compoundKey: uniqueIndex("identifier_token_idx").on(
            table.identifier,
            table.token
        ),
    })
);

export const follows = mysqlTable(
    "follows",
    {
        followerId: varchar("followerId", { length: 255 }).notNull(),
        followingId: varchar("followingId", { length: 255 }).notNull(),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        pk: uniqueIndex("follower_following_idx").on(table.followerId, table.followingId),
        followerIdx: index("follower_idx").on(table.followerId),
        followingIdx: index("following_idx").on(table.followingId),
    })
);
