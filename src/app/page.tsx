import Link from "next/link";
import { getPublicPrompts, getTrendingPrompts } from "@/db/queries/prompts";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [recentPrompts, trendingPrompts] = await Promise.all([
    getPublicPrompts(12),
    getTrendingPrompts(6),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">
          Discover Amazing AI Prompts
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Browse, share, and collaborate on the best prompts for ChatGPT, Claude, Gemini, and more
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/explore">Explore Prompts</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard/prompts/new">Submit a Prompt</Link>
          </Button>
        </div>
      </section>

      {/* Trending Section */}
      {trendingPrompts.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">🔥 Trending Now</h2>
            <Button variant="ghost" asChild>
              <Link href="/explore?sort=trending">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Prompts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Latest Prompts</h2>
          <Button variant="ghost" asChild>
            <Link href="/explore">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>
    </div>
  );
}
