"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

const PLACEHOLDER_TEXTS = [
  "Find marketing strategies",
  "Debug a React issue",
  "Prompt to write tests",
  "Email templates",
  "Data analysis prompts",
];

export function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setSubmitting(true);
    // Navigate to Explore which uses the default search endpoint and filters
    const url = trimmed ? `/explore?q=${encodeURIComponent(trimmed)}` : "/explore";
    router.push(url as any);
    setSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl">
      <div className="relative flex items-center gap-2">
        <Search className="absolute left-3 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={PLACEHOLDER_TEXTS[placeholderIndex]}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base border-2 border-border bg-card hover:border-primary focus:border-primary"
        />
        <Button type="submit" className="h-12 px-5">
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="inline-flex items-center gap-2"><Search className="w-4 h-4" />Search</span>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Press Enter to search prompts, categories, and tags
      </p>
    </form>
  );
}
