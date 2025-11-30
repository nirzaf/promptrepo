import { db } from "@/db";
import { prompts, users, categories, aiModels } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export async function getPublicPrompts(limit = 20, offset = 0, sort: "newest" | "rating" = "rating") {
    const orderBy = sort === "rating"
        ? [desc(prompts.ratingAvg), desc(prompts.ratingCount), desc(prompts.createdAt)]
        : [desc(prompts.createdAt)];

    return await db
        .select({
            id: prompts.id,
            slug: prompts.slug,
            title: prompts.title,
            description: prompts.description,
            content: prompts.content,
            viewCount: prompts.viewCount,
            copyCount: prompts.copyCount,
            ratingAvg: prompts.ratingAvg,
            ratingCount: prompts.ratingCount,
            createdAt: prompts.createdAt,
            user: {
                id: users.id,
                name: users.name,
                username: users.username,
                image: users.image,
            },
            category: {
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
                color: categories.color,
            },
            aiModel: {
                id: aiModels.id,
                name: aiModels.name,
                slug: aiModels.slug,
            },
        })
        .from(prompts)
        .leftJoin(users, eq(prompts.userId, users.id))
        .leftJoin(categories, eq(prompts.categoryId, categories.id))
        .leftJoin(aiModels, eq(prompts.aiModelId, aiModels.id))
        .where(
            and(
                eq(prompts.visibility, "public"),
                eq(prompts.status, "published")
            )
        )
        .orderBy(...orderBy)
        .limit(limit)
        .offset(offset);
}

export async function getPromptBySlug(slug: string) {
    const result = await db
        .select({
            id: prompts.id,
            slug: prompts.slug,
            title: prompts.title,
            description: prompts.description,
            content: prompts.content,
            instructions: prompts.instructions,
            exampleOutput: prompts.exampleOutput,
            variables: prompts.variables,
            viewCount: prompts.viewCount,
            copyCount: prompts.copyCount,
            bookmarkCount: prompts.bookmarkCount,
            ratingAvg: prompts.ratingAvg,
            ratingCount: prompts.ratingCount,
            createdAt: prompts.createdAt,
            updatedAt: prompts.updatedAt,
            user: {
                id: users.id,
                name: users.name,
                username: users.username,
                image: users.image,
            },
            category: {
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
                color: categories.color,
                icon: categories.icon,
            },
            aiModel: {
                id: aiModels.id,
                name: aiModels.name,
                slug: aiModels.slug,
                provider: aiModels.provider,
            },
        })
        .from(prompts)
        .leftJoin(users, eq(prompts.userId, users.id))
        .leftJoin(categories, eq(prompts.categoryId, categories.id))
        .leftJoin(aiModels, eq(prompts.aiModelId, aiModels.id))
        .where(eq(prompts.slug, slug))
        .limit(1);

    return result[0] || null;
}

export async function getTrendingPrompts(limit = 10) {
    return await db
        .select({
            id: prompts.id,
            slug: prompts.slug,
            title: prompts.title,
            description: prompts.description,
            content: prompts.content,
            viewCount: prompts.viewCount,
            copyCount: prompts.copyCount,
            ratingAvg: prompts.ratingAvg,
            ratingCount: prompts.ratingCount,
            user: {
                name: users.name,
                username: users.username,
                image: users.image,
            },
            category: {
                id: categories.id,
                name: categories.name,
                slug: categories.slug,
                color: categories.color,
            },
        })
        .from(prompts)
        .leftJoin(users, eq(prompts.userId, users.id))
        .leftJoin(categories, eq(prompts.categoryId, categories.id))
        .where(
            and(
                eq(prompts.visibility, "public"),
                eq(prompts.status, "published")
            )
        )
        .orderBy(
            desc(
                sql`(${prompts.viewCount} * 1 + ${prompts.copyCount} * 3 + ${prompts.ratingCount} * 5)`
            )
        )
        .limit(limit);
}

export async function getCategories() {
    return await db
        .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            description: categories.description,
            icon: categories.icon,
            color: categories.color,
            parentId: categories.parentId,
            sortOrder: categories.sortOrder,
            createdAt: categories.createdAt,
            promptCount: sql<number>`CAST(COUNT(DISTINCT ${prompts.id}) AS UNSIGNED)`,
        })
        .from(categories)
        .leftJoin(
            prompts,
            and(
                eq(prompts.categoryId, categories.id),
                eq(prompts.visibility, "public"),
                eq(prompts.status, "published")
            )
        )
        .groupBy(categories.id)
        .orderBy(categories.sortOrder, categories.name);
}

export async function getAIModels() {
    return await db
        .select()
        .from(aiModels)
        .where(eq(aiModels.isActive, 1))
        .orderBy(aiModels.sortOrder, aiModels.name);
}
