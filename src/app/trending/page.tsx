export const dynamic = "force-dynamic";
import { getTrendingPrompts } from "@/db/queries/prompts";
import { PromptCard } from "@/components/prompts/prompt-card";

export default async function TrendingPage() {
    const prompts = await getTrendingPrompts(20);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Trending Prompts</h1>
            <p className="text-muted-foreground mb-8">
                Discover the most popular and highly rated prompts in the community.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                ))}
            </div>
        </div>
    );
}
