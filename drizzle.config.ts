import { type Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema/index.ts",
    dialect: "mysql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    tablesFilter: ["promptvault_*"],
} satisfies Config;
