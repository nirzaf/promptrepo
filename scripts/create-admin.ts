import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import path from "node:path";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateId } from "@/lib/utils";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function ensurePasswordColumn(connection: mysql.Connection) {
  const [rows] = await connection.query(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'passwordHash'"
  );
  // @ts-ignore
  if (!rows.length) {
    await connection.query("ALTER TABLE `users` ADD COLUMN `passwordHash` varchar(255)");
  }
}

async function main() {
  const email = "fazrinphcc@gmail.com";
  const password = "YahmikAllah@123";
  const name = "Admin Fazrin";
  const username = "fazrin";

  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: true },
  });

  await ensurePasswordColumn(connection);

  const db = drizzle(connection);
  const existing = await db.select().from(users).where(eq(users.email, email));

  const hash = await bcrypt.hash(password, 10);

  if (existing.length === 0) {
    await db.insert(users).values({
      id: generateId(),
      email,
      name,
      username,
      role: "admin",
      passwordHash: hash,
      emailVerified: new Date(),
      isVerified: true,
    });
    console.log("Admin user created");
  } else {
    await db
      .update(users)
      .set({ name, username, role: "admin", passwordHash: hash, emailVerified: new Date(), isVerified: true })
      .where(eq(users.email, email));
    console.log("Admin user updated");
  }

  await connection.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

