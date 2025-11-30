"use server";

import { db } from "@/db";
import { ratings, prompts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ratePromptSchema = z.object({
    promptId: z.string(),
    score: z.number().min(1).max(5),
    guestFingerprint: z.string().optional(),
});

export async function ratePrompt(data: z.infer<typeof ratePromptSchema>) {
    const session = await auth();
    const userId = session?.user?.id;

    const { promptId, score, guestFingerprint } = ratePromptSchema.parse(data);

    if (!userId && !guestFingerprint) {
        throw new Error("User ID or Guest Fingerprint required");
    }

    // Check if already rated
    let existingRating;
    if (userId) {
        existingRating = await db.query.ratings.findFirst({
            where: and(eq(ratings.promptId, promptId), eq(ratings.userId, userId)),
        });
    } else if (guestFingerprint) {
        existingRating = await db.query.ratings.findFirst({
            where: and(
                eq(ratings.promptId, promptId),
                eq(ratings.guestFingerprint, guestFingerprint)
            ),
        });
    }

    if (existingRating) {
        // Update existing rating
        await db
            .update(ratings)
            .set({ score })
            .where(eq(ratings.id, existingRating.id));
    } else {
        // Create new rating
        await db.insert(ratings).values({
            id: crypto.randomUUID(),
            promptId,
            userId: userId || null,
            guestFingerprint: guestFingerprint || null,
            score,
        });
    }

    // Update prompt average rating
    // This is a simplified calculation. Ideally, use an aggregation query.
    // For now, let's just trigger a re-calculation or increment.
    // Better: Calculate average from ratings table.

    const allRatings = await db
        .select({ score: ratings.score })
        .from(ratings)
        .where(eq(ratings.promptId, promptId));

    const totalScore = allRatings.reduce((acc, r) => acc + r.score, 0);
    const count = allRatings.length;
    const avg = count > 0 ? (totalScore / count).toFixed(2) : "0.00";

    await db
        .update(prompts)
        .set({
            ratingAvg: avg,
            ratingCount: count,
        })
        .where(eq(prompts.id, promptId));

    revalidatePath(`/prompt/${promptId}`);
    return { success: true };
}
