import { type Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema/index.ts",
    dialect: "mysql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        ssl: {
            rejectUnauthorized: true,
        },
    },
    tablesFilter: ["promptvault_*"],
} satisfies Config;
