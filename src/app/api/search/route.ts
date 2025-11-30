import { searchPrompts } from "@/db/queries/search-queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category") || undefined;
    const aiModelSlug = searchParams.get("aiModel") || undefined;

    const results = await searchPrompts(query, {
        categorySlug,
        aiModelSlug,
        limit: 20,
    });

    // Format results for command palette
    const formattedResults = results.map((result) => ({
        id: result.id,
        document: {
            id: result.id,
            title: result.title,
            slug: result.slug,
            description: result.description,
            type: "prompt" as const,
        },
    }));

    return NextResponse.json({ results: { hits: formattedResults } });
}
