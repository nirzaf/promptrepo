import { type Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema/index.ts",
    dialect: "mysql",
    dbCredentials: {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_DATABASE!,
        ssl: {
            rejectUnauthorized: true,
        },
    },
    tablesFilter: ["promptvault_*"],
} satisfies Config;
