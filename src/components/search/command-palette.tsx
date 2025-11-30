"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Hash, Sparkles, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type SearchResult = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    type: "prompt" | "category" | "tag";
};

const PLACEHOLDER_TEXTS = [
    "Find me a marketing strategy...",
    "Help me debug React code...",
    "I need a prompt to write Python tests...",
    "Show me email templates...",
    "Search for data analysis prompts...",
];

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const router = useRouter();
    const debounceTimeout = useRef<NodeJS.Timeout>();
    const abortController = useRef<AbortController>();

    // Cycle through placeholders
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Keyboard shortcut
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

    // Debounced search with abort controller
    const performSearch = useCallback(async (searchQuery: string) => {
        // Cancel previous request
        if (abortController.current) {
            abortController.current.abort();
        }

        if (searchQuery.length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        abortController.current = new AbortController();

        try {
            const response = await fetch(
                `/api/search?q=${encodeURIComponent(searchQuery)}`,
                { signal: abortController.current.signal }
            );
            const data = await response.json();
            setResults(data.results?.hits || []);
        } catch (error) {
            if (error instanceof Error && error.name !== "AbortError") {
                console.error("Search error:", error);
                setResults([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced input handler
    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            performSearch(query);
        }, 300); // 300ms debounce

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [query, performSearch]);

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
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border-2 border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-all w-full md:w-64 glass backdrop-blur-md group"
            >
                <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="flex-1 text-left">Search prompts...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl p-0 glass overflow-hidden">
                    <DialogTitle className="sr-only">Search</DialogTitle>

                    {/* Fixed Search Input */}
                    <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border/60">
                        <div className="flex items-center px-4 py-3">
                            <Search className="w-5 h-5 mr-3 text-muted-foreground shrink-0" />
                            <input
                                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                                placeholder={PLACEHOLDER_TEXTS[placeholderIndex]}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                            {loading && (
                                <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                            )}
                        </div>
                    </div>

                    {/* Fixed Height Results Container - Prevents Layout Shift */}
                    <div className="min-h-[400px] max-h-[400px] overflow-y-auto p-2">
                        {/* Loading State */}
                        {loading && query.length > 1 && (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
                                <p className="text-sm">Searching...</p>
                            </div>
                        )}

                        {/* Empty State - No Query */}
                        {!loading && query.length < 2 && (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <Search className="w-12 h-12 mb-3 opacity-50" />
                                <p className="text-sm font-medium mb-1">Start typing to search</p>
                                <p className="text-xs">Try searching for prompts, categories, or tags</p>
                            </div>
                        )}

                        {/* No Results State */}
                        {!loading && query.length >= 2 && results.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <div className="w-12 h-12 mb-3 rounded-full bg-muted flex items-center justify-center">
                                    <Search className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-medium mb-1">No results found</p>
                                <p className="text-xs">Try different keywords or browse categories</p>
                            </div>
                        )}

                        {/* Results */}
                        {!loading && results.length > 0 && (
                            <div className="space-y-1">
                                {results.map((result: { id: string; document: SearchResult }) => (
                                    <button
                                        key={result.id}
                                        onClick={() => handleSelect(result.document)}
                                        className="flex items-start gap-3 w-full px-4 py-3 text-sm rounded-lg hover:bg-accent/50 transition-all text-left group border border-transparent hover:border-primary/20"
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {result.document.type === "prompt" && (
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <FileText className="w-4 h-4 text-primary" />
                                                </div>
                                            )}
                                            {result.document.type === "category" && (
                                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                                    <Sparkles className="w-4 h-4 text-accent-foreground" />
                                                </div>
                                            )}
                                            {result.document.type === "tag" && (
                                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                                                    <Hash className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                                                {result.document.title}
                                            </div>
                                            {result.document.description && (
                                                <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {result.document.description}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Hint */}
                    {results.length > 0 && (
                        <div className="sticky bottom-0 border-t border-border/60 bg-card/95 backdrop-blur-md px-4 py-2">
                            <p className="text-xs text-muted-foreground text-center">
                                Found {results.length} result{results.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
