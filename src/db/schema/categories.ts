import {
    int,
    mysqlTable,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const categories = mysqlTable(
    "categories",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        name: varchar("name", { length: 100 }).notNull(),
        slug: varchar("slug", { length: 100 }).notNull().unique(),
        description: text("description"),
        icon: varchar("icon", { length: 50 }),
        color: varchar("color", { length: 7 }),
        parentId: varchar("parentId", { length: 255 }),
        promptCount: int("promptCount").default(0),
        sortOrder: int("sortOrder").default(0),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        slugIdx: uniqueIndex("slug_idx").on(table.slug),
    })
);

export const tags = mysqlTable(
    "tags",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        name: varchar("name", { length: 50 }).notNull(),
        slug: varchar("slug", { length: 50 }).notNull().unique(),
        description: varchar("description", { length: 255 }),
        usageCount: int("usageCount").default(0),
        createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        slugIdx: uniqueIndex("slug_idx").on(table.slug),
    })
);

export const aiModels = mysqlTable(
    "ai_models",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        name: varchar("name", { length: 100 }).notNull(),
        slug: varchar("slug", { length: 100 }).notNull().unique(),
        provider: varchar("provider", { length: 100 }),
        iconUrl: varchar("iconUrl", { length: 500 }),
        color: varchar("color", { length: 7 }),
        isActive: int("isActive").default(1), // boolean in mysql is tinyint(1)
        sortOrder: int("sortOrder").default(0),
    },
    (table) => ({
        slugIdx: uniqueIndex("slug_idx").on(table.slug),
    })
);
