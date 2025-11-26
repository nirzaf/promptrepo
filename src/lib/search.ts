import { create, insert, search as oramaSearch } from "@orama/orama";
import type { Orama } from "@orama/orama";

export type PromptSearchResult = {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    slug: string;
};

let searchDB: Orama<typeof searchSchema> | null = null;

const searchSchema = {
    id: "string",
    title: "string",
    description: "string",
    content: "string",
    category: "string",
    tags: "string[]",
    slug: "string",
} as const;

export async function initializeSearch() {
    if (searchDB) return searchDB;

    searchDB = await create({
        schema: searchSchema,
    });

    return searchDB;
}

export async function indexPrompt(prompt: PromptSearchResult) {
    const db = await initializeSearch();
    await insert(db, prompt);
}

export async function searchPrompts(query: string) {
    const db = await initializeSearch();

    const results = await oramaSearch(db, {
        term: query,
        properties: ["title", "description", "content", "tags"],
        limit: 20,
    });

    return results;
}

export async function bulkIndexPrompts(prompts: PromptSearchResult[]) {
    const db = await initializeSearch();

    for (const prompt of prompts) {
        await insert(db, prompt);
    }
}
