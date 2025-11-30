export const dynamic = "force-dynamic";
import {
  getPublicPrompts,
  getCategories,
  getAIModels,
} from "@/db/queries/prompts";
import { ExploreClient } from "@/components/explore/explore-client";
import * as Icons from "lucide-react";

export default async function ExplorePage() {
  const [prompts, categories, aiModels] = await Promise.all([
    getPublicPrompts(100, 0, "rating"), // Fetch more prompts for pagination
    getCategories(),
    getAIModels(),
  ]);

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

      {/* Filters Section */}
      <div className="mb-10">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="category-filter" className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground">
              <Icons.Grid3x3 className="w-4 h-4" />
              Category
            </label>
            <select id="category-filter" className="w-full border-2 border-border bg-card text-foreground rounded-lg px-4 py-2.5 transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="model-filter" className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground">
              <Icons.Cpu className="w-4 h-4" />
              AI Model
            </label>
            <select id="model-filter" className="w-full border-2 border-border bg-card text-foreground rounded-lg px-4 py-2.5 transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
              <option value="">All Models</option>
              {aiModels.map((model) => (
                <option key={model.id} value={model.slug}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prompts Grid with Pagination */}
      {prompts.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <Icons.SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No prompts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <ExploreClient prompts={prompts} itemsPerPage={12} />
      )}
    </div>
  );
}
