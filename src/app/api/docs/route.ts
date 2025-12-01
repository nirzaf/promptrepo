import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

type Doc = {
    slug: string;
    title: string;
    content: string;
    fileName: string;
};

export async function GET() {
    let docs: Doc[] = [];

    try {
        const docsDirectory = path.join(process.cwd(), "docs");

        if (fs.existsSync(docsDirectory)) {
            const fileNames = fs.readdirSync(docsDirectory);

            docs = fileNames
                .filter(fileName => fileName.endsWith(".md") || fileName.endsWith(".MD"))
                .map(fileName => {
                    try {
                        const filePath = path.join(docsDirectory, fileName);
                        const fileContent = fs.readFileSync(filePath, "utf8");
                        const slug = fileName.replace(/\.md$/i, "");

                        const titleMatch = fileContent.match(/^#\s+(.+)$/m);
                        const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, " ");

                        return {
                            slug,
                            title,
                            content: fileContent,
                            fileName,
                        };
                    } catch (fileError) {
                        console.error(`Error reading file ${fileName}:`, fileError);
                        return null;
                    }
                })
                .filter((doc): doc is Doc => doc !== null);
        }
    } catch (error) {
        console.error("Error reading docs directory:", error);
    }

    // If no docs found, return a welcome doc
    if (docs.length === 0) {
        docs = [{
            slug: "welcome",
            title: "Welcome to PromptVault",
            content: "# Welcome to PromptVault\n\nDocumentation is being set up. Please check back soon!",
            fileName: "welcome.md"
        }];
    }

    return NextResponse.json({ docs });
}
