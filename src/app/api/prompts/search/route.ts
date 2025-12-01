import { searchPrompts } from "@/db/queries/search-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("q") || "";
        const categorySlug = searchParams.get("category") || undefined;
        const aiModelSlug = searchParams.get("aiModel") || undefined;
        const tags = searchParams.get("tags") ? searchParams.get("tags")!.split(",") : undefined;

        const prompts = await searchPrompts(query, {
            categorySlug,
            aiModelSlug,
            tags,
            limit: 100, // Get more results for client-side pagination
        });

        return NextResponse.json({ prompts });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { prompts: [], error: "Failed to fetch prompts" },
            { status: 500 }
        );
    }
}
