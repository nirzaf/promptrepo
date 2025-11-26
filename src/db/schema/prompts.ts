import {
    boolean,
    decimal,
    index,
    int,
    json,
    mysqlEnum,
    mysqlTable,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { categories, aiModels, tags } from "./categories";

export const prompts = mysqlTable(
    "prompts",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        userId: varchar("userId", { length: 255 }).notNull(),
        slug: varchar("slug", { length: 255 }).notNull().unique(),
        title: varchar("title", { length: 255 }).notNull(),
        content: text("content").notNull(),
        description: text("description"),
        instructions: text("instructions"),
        exampleOutput: text("exampleOutput"),
        variables: json("variables"),

        categoryId: varchar("categoryId", { length: 255 }),
        aiModelId: varchar("aiModelId", { length: 255 }),

        visibility: mysqlEnum("visibility", ["public", "private", "unlisted"]).default("public"),
        status: mysqlEnum("status", ["draft", "published", "archived"]).default("published"),
        isFeatured: boolean("isFeatured").default(false),
        isStaffPick: boolean("isStaffPick").default(false),

        viewCount: int("viewCount").default(0),
        copyCount: int("copyCount").default(0),
        bookmarkCount: int("bookmarkCount").default(0),
        forkCount: int("forkCount").default(0),
        shareCount: int("shareCount").default(0),
        commentCount: int("commentCount").default(0),

        ratingAvg: decimal("ratingAvg", { precision: 3, scale: 2 }).default("0.00"),
        ratingCount: int("ratingCount").default(0),

        metaTitle: varchar("metaTitle", { length: 70 }),
        metaDescription: varchar("metaDescription", { length: 160 }),
        ogImageUrl: varchar("ogImageUrl", { length: 500 }),

        forkedFromId: varchar("forkedFromId", { length: 255 }),

        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
        updatedAt: timestamp("updatedAt").onUpdateNow(),
        publishedAt: timestamp("publishedAt"),
    },
    (table) => ({
        slugIdx: uniqueIndex("slug_idx").on(table.slug),
        userIdIdx: index("userId_idx").on(table.userId),
        categoryIdIdx: index("categoryId_idx").on(table.categoryId),
    })
);

export const promptVersions = mysqlTable(
    "prompt_versions",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        promptId: varchar("promptId", { length: 255 }).notNull(),
        versionNumber: int("versionNumber").notNull(),
        title: varchar("title", { length: 255 }).notNull(),
        content: text("content").notNull(),
        description: text("description"),
        changeSummary: varchar("changeSummary", { length: 500 }),
        createdBy: varchar("createdBy", { length: 255 }).notNull(),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        promptIdIdx: index("promptId_idx").on(table.promptId),
        uniqueVersion: uniqueIndex("unique_version").on(table.promptId, table.versionNumber),
    })
);

export const promptTags = mysqlTable(
    "prompt_tags",
    {
        promptId: varchar("promptId", { length: 255 }).notNull(),
        tagId: varchar("tagId", { length: 255 }).notNull(),
    },
    (table) => ({
        pk: uniqueIndex("prompt_tag_pk").on(table.promptId, table.tagId),
        tagIdx: index("tag_idx").on(table.tagId),
    })
);
