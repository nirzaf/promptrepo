import { db } from "../src/db/index.js";
import { users } from "../src/db/schema/index.js";
import { eq } from "drizzle-orm";

async function seedAdmin() {
    try {
        // Check if any admin exists
        const existingAdmin = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.role, "admin"),
        });

        if (existingAdmin) {
            console.log("✅ Admin user already exists:", existingAdmin.email);
            return;
        }

        // Find the first user and make them admin
        const firstUser = await db.query.users.findFirst();

        if (!firstUser) {
            console.log("❌ No users found. Please create a user first.");
            return;
        }

        // Update the first user to admin
        await db
            .update(users)
            .set({ role: "admin" })
            .where(eq(users.id, firstUser.id));

        console.log("✅ Successfully made user admin:", firstUser.email);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    } finally {
        process.exit(0);
    }
}

seedAdmin();
