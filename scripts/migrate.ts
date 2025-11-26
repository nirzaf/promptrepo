import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function runMigrations() {
    console.log("🔄 Connecting to database...");

    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not defined in environment variables");
    }

    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: true,
        },
    });

    const db = drizzle(connection);

    console.log("🚀 Running migrations...");

    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ Migrations completed successfully!");

    await connection.end();
    process.exit(0);
}

runMigrations().catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
});
