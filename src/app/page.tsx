export const dynamic = "force-dynamic";
import Link from "next/link";
import { getPublicPrompts, getTrendingPrompts } from "@/db/queries/prompts";
import { PromptCard } from "@/components/prompts/prompt-card";
import { Button } from "@/components/ui/button";
import { SpotlightGrid } from "@/components/ui/spotlight-grid";

export default async function HomePage() {
  const [recentPrompts, trendingPrompts] = await Promise.all([
    getPublicPrompts(12),
    getTrendingPrompts(6),
  ]);

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="relative text-center py-20">
        <h1 className="text-6xl font-extrabold mb-5 tracking-tight">
          <span className="text-gradient">
            Discover Powerful AI Prompts
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Browse, share, and collaborate on exceptional prompts for ChatGPT, Claude, Gemini, and more.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild className="glow">
            <Link href="/explore">Explore Prompts</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-foreground font-semibold">
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
          <SpotlightGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPrompts.map((prompt, index) => (
              <div key={prompt.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <PromptCard prompt={prompt} />
              </div>
            ))}
          </SpotlightGrid>
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
        <SpotlightGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPrompts.map((prompt, index) => (
            <div key={prompt.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <PromptCard prompt={prompt} />
            </div>
          ))}
        </SpotlightGrid>
      </section>
    </div>
  );
}
