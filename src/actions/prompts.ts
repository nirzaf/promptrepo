"use server";

import { db } from "@/db";
import { prompts } from "@/db/schema";
import { generateId, generateSlug } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

const createPromptSchema = z.object({
    title: z.string().min(5).max(255),
    description: z.string().max(500).optional(),
    content: z.string().min(20).max(10000),
    instructions: z.string().max(2000).optional(),
    categoryId: z.string().optional(),
    aiModelId: z.string().optional(),
    visibility: z.enum(["public", "private", "unlisted"]).default("public"),
    forkedFromId: z.string().optional(),
});

export async function createPrompt(formData: FormData) {
    // Check authentication
    const session = await auth();
    const userId = session?.user?.id || null;

    // if (!session?.user?.id) {
    //     throw new Error("You must be logged in to create a prompt");
    // }

    const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        content: formData.get("content") as string,
        instructions: formData.get("instructions") as string,
        categoryId: formData.get("categoryId") as string,
        aiModelId: formData.get("aiModelId") as string,
        visibility: (formData.get("visibility") as any) || "public",
        forkedFromId: formData.get("forkedFromId") as string,
    };

    const validated = createPromptSchema.parse(data);

    const slug = generateSlug(validated.title);
    const id = generateId();

    await db.insert(prompts).values({
        id,
        userId,
        slug,
        title: validated.title,
        description: validated.description || null,
        content: validated.content,
        instructions: validated.instructions || null,
        categoryId: validated.categoryId || null,
        aiModelId: validated.aiModelId || null,
        visibility: validated.visibility,
        status: "published",
        forkedFromId: validated.forkedFromId || null,
    });

    // Invalidate caches
    revalidatePath("/");
    revalidatePath("/explore");
    redirect(`/prompt/${slug}`);
}

export async function incrementViewCount(promptId: string) {
    await db
        .update(prompts)
        .set({ viewCount: sql`${prompts.viewCount} + 1` })
        .where(eq(prompts.id, promptId));
}

export async function incrementCopyCount(promptId: string) {
    await db
        .update(prompts)
        .set({ copyCount: sql`${prompts.copyCount} + 1` })
        .where(eq(prompts.id, promptId));
}
