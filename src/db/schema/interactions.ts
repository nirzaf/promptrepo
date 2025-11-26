import {
    boolean,
    index,
    int,
    mysqlEnum,
    mysqlTable,
    text,
    timestamp,
    tinyint,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const ratings = mysqlTable(
    "ratings",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        promptId: varchar("promptId", { length: 255 }).notNull(),
        userId: varchar("userId", { length: 255 }),
        guestFingerprint: varchar("guestFingerprint", { length: 64 }),
        score: tinyint("score").notNull(),
        ipHash: varchar("ipHash", { length: 64 }),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
        updatedAt: timestamp("updatedAt").onUpdateNow(),
    },
    (table) => ({
        promptIdx: index("prompt_idx").on(table.promptId),
        userIdIdx: index("userId_idx").on(table.userId),
        uniqueUserRating: uniqueIndex("unique_user_rating").on(table.promptId, table.userId),
        uniqueGuestRating: uniqueIndex("unique_guest_rating").on(table.promptId, table.guestFingerprint),
    })
);

export const bookmarks = mysqlTable(
    "bookmarks",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        userId: varchar("userId", { length: 255 }).notNull(),
        promptId: varchar("promptId", { length: 255 }).notNull(),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        uniqueBookmark: uniqueIndex("unique_bookmark").on(table.userId, table.promptId),
        userIdIdx: index("userId_idx").on(table.userId),
    })
);

export const collections = mysqlTable(
    "collections",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        userId: varchar("userId", { length: 255 }).notNull(),
        name: varchar("name", { length: 100 }).notNull(),
        slug: varchar("slug", { length: 100 }).notNull(),
        description: text("description"),
        coverImageUrl: varchar("coverImageUrl", { length: 500 }),
        visibility: mysqlEnum("visibility", ["public", "private"]).default("private"),
        promptCount: int("promptCount").default(0),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
        updatedAt: timestamp("updatedAt").onUpdateNow(),
    },
    (table) => ({
        uniqueUserSlug: uniqueIndex("unique_user_slug").on(table.userId, table.slug),
        userIdIdx: index("userId_idx").on(table.userId),
    })
);

export const collectionPrompts = mysqlTable(
    "collection_prompts",
    {
        collectionId: varchar("collectionId", { length: 255 }).notNull(),
        promptId: varchar("promptId", { length: 255 }).notNull(),
        sortOrder: int("sortOrder").default(0),
        addedAt: timestamp("addedAt").default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        pk: uniqueIndex("collection_prompt_pk").on(table.collectionId, table.promptId),
        promptIdx: index("prompt_idx").on(table.promptId),
    })
);

export const comments = mysqlTable(
    "comments",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        promptId: varchar("promptId", { length: 255 }).notNull(),
        userId: varchar("userId", { length: 255 }).notNull(),
        parentId: varchar("parentId", { length: 255 }),
        content: text("content").notNull(),
        isEdited: boolean("isEdited").default(false),
        likeCount: int("likeCount").default(0),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
        updatedAt: timestamp("updatedAt").onUpdateNow(),
    },
    (table) => ({
        promptIdx: index("prompt_idx").on(table.promptId),
        userIdIdx: index("userId_idx").on(table.userId),
        parentIdx: index("parent_idx").on(table.parentId),
    })
);
