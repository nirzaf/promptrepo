import { db } from "@/db";
import { users, prompts, categories, aiModels } from "@/db/schema";
import { eq, desc, like, or, and, sql } from "drizzle-orm";

// Admin queries do NOT filter by visibility/status unless explicitly requested

export async function getAllUsers(page = 1, limit = 50, search?: string) {
    const offset = (page - 1) * limit;

    let query = db
        .select({
            id: users.id,
            name: users.name,
            username: users.username,
            email: users.email,
            image: users.image,
            role: users.role,
            isVerified: users.isVerified,
            reputationScore: users.reputationScore,
            createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);

    if (search) {
        query = query.where(
            or(
                like(users.name, `%${search}%`),
                like(users.email, `%${search}%`),
                like(users.username, `%${search}%`)
            )
        ) as any;
    }

    return await query;
}

export async function getAllPrompts(page = 1, limit = 50, filter?: {
    status?: "draft" | "published" | "archived";
    visibility?: "public" | "private" | "unlisted";
    search?: string;
}) {
    const offset = (page - 1) * limit;

    let conditions = [];

    if (filter?.status) {
        conditions.push(eq(prompts.status, filter.status));
    }

    if (filter?.visibility) {
        conditions.push(eq(prompts.visibility, filter.visibility));
    }

    if (filter?.search) {
        conditions.push(
            or(
                like(prompts.title, `%${filter.search}%`),
                like(prompts.description, `%${filter.search}%`)
            )
        );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return await db
        .select({
            id: prompts.id,
            slug: prompts.slug,
            title: prompts.title,
            description: prompts.description,
            userId: prompts.userId,
            status: prompts.status,
            visibility: prompts.visibility,
            viewCount: prompts.viewCount,
            copyCount: prompts.copyCount,
            ratingAvg: prompts.ratingAvg,
            ratingCount: prompts.ratingCount,
            createdAt: prompts.createdAt,
            user: {
                name: users.name,
                email: users.email,
            },
            category: {
                name: categories.name,
            },
        })
        .from(prompts)
        .leftJoin(users, eq(prompts.userId, users.id))
        .leftJoin(categories, eq(prompts.categoryId, categories.id))
        .where(whereClause)
        .orderBy(desc(prompts.createdAt))
        .limit(limit)
        .offset(offset);
}

export async function getUserById(userId: string) {
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
    });
}

export async function getPromptById(promptId: string) {
    const result = await db
        .select({
            id: prompts.id,
            slug: prompts.slug,
            title: prompts.title,
            content: prompts.content,
            description: prompts.description,
            userId: prompts.userId,
            status: prompts.status,
            visibility: prompts.visibility,
            createdAt: prompts.createdAt,
            user: {
                name: users.name,
                email: users.email,
            },
        })
        .from(prompts)
        .leftJoin(users, eq(prompts.userId, users.id))
        .where(eq(prompts.id, promptId))
        .limit(1);

    return result[0] || null;
}

export async function getAllCategories() {
    return await db
        .select()
        .from(categories)
        .orderBy(categories.sortOrder, categories.name);
}

export async function getAllAIModels() {
    return await db
        .select()
        .from(aiModels)
        .orderBy(aiModels.sortOrder, aiModels.name);
}

export async function getAdminStats() {
    const [userCount, promptCount, categoryCount] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users),
        db.select({
            total: sql<number>`count(*)`,
            published: sql<number>`sum(case when status = 'published' then 1 else 0 end)`,
            draft: sql<number>`sum(case when status = 'draft' then 1 else 0 end)`,
            archived: sql<number>`sum(case when status = 'archived' then 1 else 0 end)`,
        }).from(prompts),
        db.select({ count: sql<number>`count(*)` }).from(categories),
    ]);

    return {
        users: userCount[0]?.count || 0,
        prompts: {
            total: promptCount[0]?.total || 0,
            published: promptCount[0]?.published || 0,
            draft: promptCount[0]?.draft || 0,
            archived: promptCount[0]?.archived || 0,
        },
        categories: categoryCount[0]?.count || 0,
    };
}
