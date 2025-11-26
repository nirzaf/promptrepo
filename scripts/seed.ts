import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { categories, aiModels } from "../src/db/schema";
import { DEFAULT_CATEGORIES, DEFAULT_AI_MODELS } from "../src/config/site";
import { generateId } from "../src/lib/utils";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seed() {
    console.log("🌱 Seeding database...");

    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined");
    }

    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: true,
        },
    });

    const db = drizzle(connection);

    // Seed categories
    console.log("📁 Seeding categories...");
    for (const category of DEFAULT_CATEGORIES) {
        try {
            await db.insert(categories).values({
                id: generateId(),
                ...category,
            });
        } catch (error: any) {
            if (error.code !== 'ER_DUP_ENTRY') {
                throw error;
            }
            console.log(`Category "${category.name}" already exists, skipping...`);
        }
    }

    // Seed AI models
    console.log("🤖 Seeding AI models...");
    for (const model of DEFAULT_AI_MODELS) {
        try {
            await db.insert(aiModels).values({
                id: generateId(),
                ...model,
            });
        } catch (error: any) {
            if (error.code !== 'ER_DUP_ENTRY') {
                throw error;
            }
            console.log(`AI Model "${model.name}" already exists, skipping...`);
        }
    }

    console.log("✅ Database seeded successfully!");
    await connection.end();
    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
});
