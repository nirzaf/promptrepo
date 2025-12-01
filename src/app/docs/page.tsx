"use client";

import { useEffect, useState } from "react";
import { DocsClient } from "@/components/docs/docs-client";

type Doc = {
    slug: string;
    title: string;
    content: string;
    fileName: string;
};

export default function DocsPage() {
    const [docs, setDocs] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDocs() {
            try {
                const response = await fetch("/api/docs");
                const data = await response.json();
                setDocs(data.docs || []);
            } catch (error) {
                console.error("Error fetching docs:", error);
                // Set fallback doc
                setDocs([{
                    slug: "welcome",
                    title: "Welcome to PromptVault",
                    content: "# Welcome to PromptVault\n\nDocumentation is being set up.",
                    fileName: "welcome.md"
                }]);
            } finally {
                setLoading(false);
            }
        }

        fetchDocs();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-muted-foreground">Loading documentation...</p>
                    </div>
                </div>
            </div>
        );
    }

    const defaultDoc = docs.find(d => d.slug === "PROJECT-GUIDE") || docs[0];

    return (
        <DocsClient
            docs={docs}
            defaultDoc={defaultDoc}
        />
    );
}
