import "dotenv/config";
import { db } from "@/db";
import { tags } from "@/db/schema";

async function checkTags() {
    console.log("Checking tags...");
    const allTags = await db.select().from(tags);
    console.log(`Found ${allTags.length} tags:`);
    console.log(JSON.stringify(allTags, null, 2));
    process.exit(0);
}

checkTags().catch((err) => {
    console.error("Error checking tags:", err);
    process.exit(1);
});
