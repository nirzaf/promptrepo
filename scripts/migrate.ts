import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";

import * as schema from "../src/db/schema/index";

async function runMigrations() {
    console.log("🔄 Connecting to database...");

    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL!,
        ssl: {
            rejectUnauthorized: true,
        },
    });

    const db = drizzle(connection, { schema, mode: "default" });

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
