export const revalidate = 60; // ISR: Revalidate every 60 seconds
import {
  getPublicPrompts,
  getCategories,
  getAIModels,
  getTags,
} from "@/db/queries/prompts";
import { ExploreWrapper } from "@/components/explore/explore-wrapper";

export default async function ExplorePage() {
  const [prompts, categories, aiModels, tags] = await Promise.all([
    getPublicPrompts(100, 0, "rating"),
    getCategories(),
    getAIModels(),
    getTags(),
  ]);

  return (
    <ExploreWrapper
      initialPrompts={prompts}
      categories={categories}
      aiModels={aiModels}
      tags={tags}
      itemsPerPage={12}
    />
  );
}
