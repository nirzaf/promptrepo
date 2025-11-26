import { db } from "@/db";
import { categories, aiModels } from "@/db/schema";
import { DEFAULT_CATEGORIES, DEFAULT_AI_MODELS } from "@/config/site";
import { generateId } from "@/lib/utils";

async function seed() {
    console.log("🌱 Seeding database...");

    // Seed categories
    console.log("📁 Seeding categories...");
    for (const category of DEFAULT_CATEGORIES) {
        await db.insert(categories).values({
            id: generateId(),
            ...category,
        });
    }

    // Seed AI models
    console.log("🤖 Seeding AI models...");
    for (const model of DEFAULT_AI_MODELS) {
        await db.insert(aiModels).values({
            id: generateId(),
            ...model,
        });
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
});
