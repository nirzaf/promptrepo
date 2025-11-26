"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Hash, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type SearchResult = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    type: "prompt" | "category" | "tag";
};

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    useEffect(() => {
        if (query.length > 1) {
            setLoading(true);
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then((res) => res.json())
                .then((data) => {
                    setResults(data.results?.hits || []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setResults([]);
        }
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        setOpen(false);
        setQuery("");

        if (result.type === "prompt") {
            router.push(`/prompt/${result.slug}`);
        } else if (result.type === "category") {
            router.push(`/category/${result.slug}` as any);
        } else if (result.type === "tag") {
            router.push(`/tag/${result.slug}` as any);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border rounded-md hover:bg-accent transition-colors w-full md:w-64"
            >
                <Search className="w-4 h-4" />
                <span>Search prompts...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">Cmd</span>K
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl p-0">
                    <div className="flex items-center border-b px-3">
                        <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                        <input
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search prompts, categories, tags..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto p-2">
                        {loading && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Searching...
                            </div>
                        )}

                        {!loading && query.length > 1 && results.length === 0 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No results found.
                            </div>
                        )}

                        {!loading && results.length > 0 && (
                            <div className="space-y-1">
                                {results.map((result: any) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleSelect(result.document)}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left"
                                    >
                                        {result.document.type === "prompt" && (
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                        )}
                                        {result.document.type === "category" && (
                                            <Sparkles className="w-4 h-4 text-muted-foreground" />
                                        )}
                                        {result.document.type === "tag" && (
                                            <Hash className="w-4 h-4 text-muted-foreground" />
                                        )}
                                        <div className="flex-1">
                                            <div className="font-medium">{result.document.title}</div>
                                            {result.document.description && (
                                                <div className="text-xs text-muted-foreground line-clamp-1">
                                                    {result.document.description}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
