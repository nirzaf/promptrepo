import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { categories } from "../src/db/schema";
import { DEFAULT_CATEGORIES } from "../src/config/site";
import * as dotenv from "dotenv";
import * as path from "path";
import { eq } from "drizzle-orm";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function updateIcons() {
    console.log("🔄 Updating category icons...");

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

    for (const category of DEFAULT_CATEGORIES) {
        await db
            .update(categories)
            .set({ icon: category.icon })
            .where(eq(categories.slug, category.slug));
        console.log(`Updated icon for "${category.name}"`);
    }

    console.log("✅ Icons updated successfully!");
    await connection.end();
    process.exit(0);
}

updateIcons().catch((error) => {
    console.error("❌ Error updating icons:", error);
    process.exit(1);
});
