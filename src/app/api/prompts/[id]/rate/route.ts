import { db } from "@/db";
import { ratings, prompts } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

type Props = {
    params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Props) {
    const { id } = await params;
    const body = await request.json();
    const { score } = body;

    if (!score || score < 1 || score > 5) {
        return NextResponse.json(
            { error: "Invalid rating score" },
            { status: 400 }
        );
    }

    try {
        // Get user from session or use fingerprint for guests
        const session = await auth();
        const userId = session?.user?.id ?? null;

        // For guest users, get fingerprint from request body
        const guestFingerprint = userId ? null : (body.fingerprint || null);

        // Insert rating
        await db.insert(ratings).values({
            id: generateId(),
            promptId: id,
            userId,
            guestFingerprint,
            score,
        });

        // Update prompt rating average
        const result = await db
            .select({
                avg: sql<number>`AVG(${ratings.score})`,
                count: sql<number>`COUNT(*)`,
            })
            .from(ratings)
            .where(eq(ratings.promptId, id));

        if (result[0]) {
            await db
                .update(prompts)
                .set({
                    ratingAvg: result[0].avg.toFixed(2),
                    ratingCount: result[0].count,
                })
                .where(eq(prompts.id, id));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Rating error:", error);
        return NextResponse.json(
            { error: "Failed to submit rating" },
            { status: 500 }
        );
    }
}
