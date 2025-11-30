export const dynamic = "force-dynamic";
import {
  getPublicPrompts,
  getCategories,
  getAIModels,
} from "@/db/queries/prompts";
import { ExploreClient } from "@/components/explore/explore-client";

export default async function ExplorePage() {
  const [prompts, categories, aiModels] = await Promise.all([
    getPublicPrompts(100, 0, "rating"),
    getCategories(),
    getAIModels(),
  ]);

  return (
    <ExploreClient
      initialPrompts={prompts}
      categories={categories}
      aiModels={aiModels}
      itemsPerPage={12}
    />
  );
}
