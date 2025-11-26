export const dynamic = "force-dynamic";
import {
  getPublicPrompts,
  getCategories,
  getAIModels,
} from "@/db/queries/prompts";
import { PromptCard } from "@/components/prompts/prompt-card";

export default async function ExplorePage() {
  const [prompts, categories, aiModels] = await Promise.all([
    getPublicPrompts(24),
    getCategories(),
    getAIModels(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Explore Prompts</h1>

      {/* Filters Section */}
      <div className="mb-8">
        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select className="border rounded-md px-3 py-2">
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">AI Model</label>
            <select className="border rounded-md px-3 py-2">
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

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}
