import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { tags } from "@/db/schema";
import { sql } from "drizzle-orm";

async function seedTags() {
    console.log("Seeding tags...");

    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);

    const sampleTags = [
        { name: "Photography", slug: "photography", description: "Prompts for generating realistic photos" },
        { name: "Coding", slug: "coding", description: "Programming and code generation prompts" },
        { name: "Writing", slug: "writing", description: "Creative writing and content generation" },
        { name: "Business", slug: "business", description: "Business strategy and marketing prompts" },
        { name: "SEO", slug: "seo", description: "Search Engine Optimization prompts" },
        { name: "Art", slug: "art", description: "Digital art and illustration prompts" },
        { name: "Productivity", slug: "productivity", description: "Prompts to boost productivity" },
        { name: "Marketing", slug: "marketing", description: "Marketing copy and strategy" },
    ];

    for (const tag of sampleTags) {
        await db.insert(tags).values({
            id: crypto.randomUUID(),
            ...tag,
            usageCount: Math.floor(Math.random() * 100),
        }).onDuplicateKeyUpdate({
            set: { usageCount: sql`usageCount` } // Do nothing if exists
        });
    }

    console.log("Tags seeded successfully!");
    await connection.end();
    process.exit(0);
}

seedTags().catch((err) => {
    console.error("Error seeding tags:", err);
    process.exit(1);
});
