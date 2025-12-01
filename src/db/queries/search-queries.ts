import { db } from "@/db";
import { prompts, users, categories, aiModels, tags as tagsTable, promptTags } from "@/db/schema";
import { eq, desc, and, or, like, sql, inArray } from "drizzle-orm";

export type SearchFilters = {
    categorySlug?: string;
    aiModelSlug?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
};

export async function searchPrompts(query: string, filters: SearchFilters = {}) {
    const {
        categorySlug,
        aiModelSlug,
        tags,
        limit = 20,
        offset = 0,
    } = filters;

    // Build where conditions
    const conditions = [
        eq(prompts.visibility, "public"),
        eq(prompts.status, "published"),
    ];

    // Add search condition if query is provided
    if (query && query.trim().length > 0) {
        const searchTerm = `%${query.trim()}%`;
        const searchCondition = or(
            like(prompts.title, searchTerm),
            like(prompts.description, searchTerm),
            like(prompts.content, searchTerm)
        );
        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    // Add category filter if provided
    if (categorySlug) {
        const category = await db
            .select({ id: categories.id })
            .from(categories)
            .where(eq(categories.slug, categorySlug))
            .limit(1);

        if (category.length > 0) {
            conditions.push(eq(prompts.categoryId, category[0].id));
        }
    }

    // Add AI model filter if provided
    if (aiModelSlug) {
        const aiModel = await db
            .select({ id: aiModels.id })
            .from(aiModels)
            .where(eq(aiModels.slug, aiModelSlug))
            .limit(1);

        if (aiModel.length > 0) {
            conditions.push(eq(prompts.aiModelId, aiModel[0].id));
        }
    }

    // Add tags filter if provided
    if (tags && tags.length > 0) {
        // Find prompts that have ANY of the selected tags (OR logic)
        // Or ALL? Usually filters are AND. But for tags, often OR.
        // Let's do OR for now as it's more common in discovery.
        // Actually, user usually expects "prompts with tag A AND tag B".
        // Let's do AND logic: prompts that have ALL selected tags.

        // 1. Get tag IDs
        const tagRecords = await db
            .select({ id: tagsTable.id })
            .from(tagsTable)
            .where(inArray(tagsTable.slug, tags));

        const tagIds = tagRecords.map(t => t.id);

        if (tagIds.length > 0) {
            // Subquery to find prompt IDs that have all these tags
            const matchingPromptIds = await db
                .select({ promptId: promptTags.promptId })
                .from(promptTags)
                .where(inArray(promptTags.tagId, tagIds))
                .groupBy(promptTags.promptId)
                .having(sql`COUNT(DISTINCT ${promptTags.tagId}) = ${tagIds.length}`);

            const ids = matchingPromptIds.map(p => p.promptId);

            if (ids.length > 0) {
                conditions.push(inArray(prompts.id, ids));
            } else {
                // No prompts match all tags
                return [];
            }
        }
    }

    // Execute search query
    const results = await db
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
                reputationScore: users.reputationScore,
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
        .where(and(...conditions))
        .orderBy(
            desc(prompts.ratingAvg),
            desc(prompts.ratingCount),
            desc(prompts.createdAt)
        )
        .limit(limit)
        .offset(offset);

    return results;
}

// Get total count for pagination
export async function getSearchCount(query: string, filters: SearchFilters = {}) {
    const { categorySlug, aiModelSlug } = filters;

    const conditions = [
        eq(prompts.visibility, "public"),
        eq(prompts.status, "published"),
    ];

    if (query && query.trim().length > 0) {
        const searchTerm = `%${query.trim()}%`;
        const searchCondition = or(
            like(prompts.title, searchTerm),
            like(prompts.description, searchTerm),
            like(prompts.content, searchTerm)
        );
        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    if (categorySlug) {
        const category = await db
            .select({ id: categories.id })
            .from(categories)
            .where(eq(categories.slug, categorySlug))
            .limit(1);

        if (category.length > 0) {
            conditions.push(eq(prompts.categoryId, category[0].id));
        }
    }

    if (aiModelSlug) {
        const aiModel = await db
            .select({ id: aiModels.id })
            .from(aiModels)
            .where(eq(aiModels.slug, aiModelSlug))
            .limit(1);

        if (aiModel.length > 0) {
            conditions.push(eq(prompts.aiModelId, aiModel[0].id));
        }
    }

    const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(prompts)
        .where(and(...conditions));

    return result[0]?.count || 0;
}
