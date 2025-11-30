"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, prompts, categories, aiModels } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { generateId, generateSlug } from "@/lib/utils";

// Helper to ensure admin
async function ensureAdmin() {
    const session = await auth();
    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }
    return session;
}

// User Management Actions
export async function updateUserRole(userId: string, role: "user" | "moderator" | "admin") {
    await ensureAdmin();

    await db
        .update(users)
        .set({ role })
        .where(eq(users.id, userId));

    revalidatePath("/admin/users");
}

export async function banUser(userId: string) {
    await ensureAdmin();

    await db
        .update(users)
        .set({ isVerified: false })
        .where(eq(users.id, userId));

    revalidatePath("/admin/users");
}

export async function unbanUser(userId: string) {
    await ensureAdmin();

    await db
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.id, userId));

    revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
    await ensureAdmin();

    // Note: This is a hard delete. Consider soft delete in production
    await db.delete(users).where(eq(users.id, userId));

    revalidatePath("/admin/users");
}

// Prompt Management Actions
export async function updatePromptStatus(
    promptId: string,
    status: "published" | "archived" | "draft"
) {
    await ensureAdmin();

    await db
        .update(prompts)
        .set({ status })
        .where(eq(prompts.id, promptId));

    revalidatePath("/admin/prompts");
    revalidatePath("/explore");
}

export async function deletePrompt(promptId: string) {
    await ensureAdmin();

    // Hard delete
    await db.delete(prompts).where(eq(prompts.id, promptId));

    revalidatePath("/admin/prompts");
    revalidatePath("/explore");
}

// Category Management Actions
export async function createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
}) {
    await ensureAdmin();

    const id = generateId();

    await db.insert(categories).values({
        id,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        color: data.color || null,
        icon: data.icon || null,
        sortOrder: 0,
    });

    revalidatePath("/admin/categories");
}

export async function updateCategory(
    categoryId: string,
    data: {
        name?: string;
        slug?: string;
        description?: string;
        color?: string;
        icon?: string;
    }
) {
    await ensureAdmin();

    await db
        .update(categories)
        .set(data)
        .where(eq(categories.id, categoryId));

    revalidatePath("/admin/categories");
}

export async function deleteCategory(categoryId: string) {
    await ensureAdmin();

    await db.delete(categories).where(eq(categories.id, categoryId));

    revalidatePath("/admin/categories");
}

// AI Model Management Actions
export async function createAIModel(data: {
    name: string;
    slug: string;
    provider?: string;
}) {
    await ensureAdmin();

    const id = generateId();

    await db.insert(aiModels).values({
        id,
        name: data.name,
        slug: data.slug,
        provider: data.provider || null,
        isActive: 1,
        sortOrder: 0,
    });

    revalidatePath("/admin/categories");
}

export async function deleteAIModel(modelId: string) {
    await ensureAdmin();

    await db.delete(aiModels).where(eq(aiModels.id, modelId));

    revalidatePath("/admin/categories");
}
