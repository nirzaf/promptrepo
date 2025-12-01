import { db } from "@/db";
import { users, prompts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Calculates and updates the reputation score for a user.
 * 
 * Formula:
 * - 5 points per prompt published
 * - 1 point per view (capped?) - maybe too easy to game. Let's skip views for now.
 * - 2 points per copy
 * - 3 points per like/bookmark (assuming bookmarkCount is like count)
 * - 5 points per fork
 */
export async function calculateReputation(userId: string) {
    // Get user's prompts stats
    const promptStats = await db
        .select({
            totalCopies: sql<number>`SUM(${prompts.copyCount})`,
            totalBookmarks: sql<number>`SUM(${prompts.bookmarkCount})`,
            totalForks: sql<number>`SUM(${prompts.forkCount})`,
            publishedCount: sql<number>`COUNT(*)`,
        })
        .from(prompts)
        .where(
            eq(prompts.userId, userId)
        );

    const stats = promptStats[0];
    if (!stats) return 0;

    const pointsFromPrompts = (stats.publishedCount || 0) * 5;
    const pointsFromCopies = (stats.totalCopies || 0) * 2;
    const pointsFromBookmarks = (stats.totalBookmarks || 0) * 3;
    const pointsFromForks = (stats.totalForks || 0) * 5;

    const totalScore = pointsFromPrompts + pointsFromCopies + pointsFromBookmarks + pointsFromForks;

    // Update user record
    await db.update(users)
        .set({ reputationScore: totalScore })
        .where(eq(users.id, userId));

    return totalScore;
}

export async function incrementReputation(userId: string, amount: number) {
    await db.update(users)
        .set({ reputationScore: sql`${users.reputationScore} + ${amount}` })
        .where(eq(users.id, userId));
}
