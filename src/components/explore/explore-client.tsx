"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Pagination } from "@/components/ui/pagination";
import { MultiSelect } from "@/components/ui/multi-select";
import * as Icons from "lucide-react";

type Prompt = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  viewCount: number | null;
  copyCount: number | null;
  ratingAvg: string | null;
  ratingCount: number | null;
  user: {
    name: string | null;
    username: string | null;
    image: string | null;
    reputationScore?: number | null;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  aiModel: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type AIModel = {
  id: string;
  name: string;
  slug: string;
};

type Tag = {
  id: string;
  name: string;
  slug: string;
  usageCount: number | null;
};

interface ExploreClientProps {
  initialPrompts: Prompt[];
  categories: Category[];
  aiModels: AIModel[];
  tags: Tag[];
  itemsPerPage?: number;
}

export function ExploreClient({
  initialPrompts,
  categories,
  aiModels,
  tags,
  itemsPerPage = 12,
}: ExploreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize state from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [modelFilter, setModelFilter] = useState(searchParams.get("aiModel") || "");

  // Parse tags from URL (comma separated)
  const initialTags = searchParams.get("tags") ? searchParams.get("tags")!.split(",") : [];
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const debounceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const totalPages = Math.ceil(prompts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPrompts = prompts.slice(startIndex, endIndex);

  // Fetch prompts based on filters
  const fetchPrompts = useCallback(
    async (query: string, category: string, model: string, tags: string[]) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category) params.set("category", category);
        if (model) params.set("aiModel", model);
        if (tags.length > 0) params.set("tags", tags.join(","));

        const response = await fetch(`/api/prompts/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setPrompts(data.prompts || []);
        setCurrentPage(1);

        // Update URL
        const newParams = new URLSearchParams();
        if (query) newParams.set("q", query);
        if (category) newParams.set("category", category);
        if (model) newParams.set("aiModel", model);
        if (tags.length > 0) newParams.set("tags", tags.join(","));

        const newUrl = newParams.toString()
          ? `/explore?${newParams.toString()}`
          : "/explore";
        window.history.replaceState(null, "", newUrl);

        // Save filters to localStorage
        localStorage.setItem("promptrepo_filters", JSON.stringify({
          category,
          model,
          tags
        }));

      } catch (error) {
        console.error("Error fetching prompts:", error);
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load saved filters on mount if URL params are empty
  useEffect(() => {
    if (!searchParams.toString()) {
      const savedFilters = localStorage.getItem("promptrepo_filters");
      if (savedFilters) {
        try {
          const { category, model, tags } = JSON.parse(savedFilters);
          if (category) setCategoryFilter(category);
          if (model) setModelFilter(model);
          if (tags && Array.isArray(tags)) setSelectedTags(tags);
        } catch (e) {
          console.error("Failed to parse saved filters", e);
        }
      }
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchPrompts(searchQuery, categoryFilter, modelFilter, selectedTags);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery, categoryFilter, modelFilter, selectedTags, fetchPrompts]);

  const handlePageChange = (page: number) => {
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  const tagOptions = tags.map(tag => ({ label: tag.name, value: tag.slug }));

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Header */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient">
          Explore Prompts
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover our curated collection of high-quality AI prompts
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-10 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts by title, description, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 border-border bg-card text-foreground rounded-lg pl-12 pr-4 py-3 transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
          {loading && (
            <Icons.Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex-1">
            <label
              htmlFor="category-filter"
              className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground"
            >
              <Icons.Grid3x3 className="w-4 h-4" />
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border-2 border-border bg-card text-foreground rounded-lg px-4 py-2.5 transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="model-filter"
              className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground"
            >
              <Icons.Cpu className="w-4 h-4" />
              AI Model
            </label>
            <select
              id="model-filter"
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="w-full border-2 border-border bg-card text-foreground rounded-lg px-4 py-2.5 transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              <option value="">All Models</option>
              {aiModels.map((model) => (
                <option key={model.id} value={model.slug}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground">
              <Icons.Tag className="w-4 h-4" />
              Tags
            </label>
            <MultiSelect
              options={tagOptions}
              selected={selectedTags}
              onChange={setSelectedTags}
              placeholder="Filter by tags..."
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchQuery || categoryFilter || modelFilter || selectedTags.length > 0) && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
                setModelFilter("");
                setSelectedTags([]);
                localStorage.removeItem("promptrepo_filters");
              }}
              className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border-2 border-border hover:border-primary rounded-lg transition-all flex items-center gap-2"
            >
              <Icons.X className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      {prompts.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{prompts.length}</span>{" "}
            {prompts.length === 1 ? "prompt" : "prompts"}
          </p>
        </div>
      )}

      {/* Prompts Grid */}
      {prompts.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <Icons.SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search query
          </p>
          {(searchQuery || categoryFilter || modelFilter || selectedTags.length > 0) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("");
                setModelFilter("");
                setSelectedTags([]);
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 auto-rows-fr mb-12 transition-opacity duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
          >
            {currentPrompts.map((prompt, index) => (
              <div
                key={`${prompt.id}-${currentPage}`}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {startIndex + 1}
                  </span>
                  -
                  <span className="font-semibold text-foreground">
                    {Math.min(endIndex, prompts.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {prompts.length}
                  </span>{" "}
                  prompts
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
