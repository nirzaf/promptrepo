import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { env } from "@/env";
import * as schema from "./schema";

export function getDb() {
    const connection = mysql.createPool({
        uri: env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: true,
        },
    });

    return drizzle(connection, { schema, mode: "default" });
}

export const db = getDb();
