"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Book, Menu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Doc = {
    slug: string;
    title: string;
    content: string;
    fileName: string;
};

type DocsClientProps = {
    docs: Doc[];
    defaultDoc: Doc;
};

export function DocsClient({ docs, defaultDoc }: DocsClientProps) {
    const [activeDoc, setActiveDoc] = useState(defaultDoc);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 ring-2 ring-primary/20">
                        <Book className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-4xl font-bold">Documentation</h1>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <aside
                    className={cn(
                        "md:col-span-1",
                        sidebarOpen ? "block" : "hidden md:block"
                    )}
                >
                    <div className="glass gradient-border rounded-xl p-4 sticky top-4">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                            Contents
                        </h2>
                        <nav className="space-y-1">
                            {docs.map((doc) => (
                                <button
                                    key={doc.slug}
                                    type="button"
                                    onClick={() => {
                                        setActiveDoc(doc);
                                        setSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                        activeDoc.slug === doc.slug
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    {doc.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-3">
                    <div className="glass gradient-border rounded-xl p-8 card-interactive">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6 pb-6 border-b border-border/50">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">{activeDoc.title}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {activeDoc.fileName}
                                </p>
                            </div>
                            <a
                                href={`https://github.com/yourusername/promptrepo/blob/main/docs/${activeDoc.fileName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Edit on GitHub
                            </a>
                        </div>

                        {/* Markdown Content */}
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            {/* @ts-expect-error remark-gfm type mismatch */}
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {activeDoc.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
