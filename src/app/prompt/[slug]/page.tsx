export const dynamic = "force-dynamic";
import { getPromptBySlug } from "@/db/queries/prompts";
import { notFound } from "next/navigation";
import { Eye, Star, Share2, BookOpen, Lightbulb, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const rating = prompt.ratingAvg ? parseFloat(prompt.ratingAvg) : 0;
  const ratingCount = prompt.ratingCount || 0;
  const viewCount = prompt.viewCount || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        {/* Category Badge */}
        {prompt.category && (
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm ring-1 ring-border/50"
              style={{
                backgroundColor: prompt.category.color
                  ? `${prompt.category.color}25`
                  : "var(--color-muted)",
                color: prompt.category.color || "var(--color-foreground)",
              }}
            >
              {prompt.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {prompt.title}
        </h1>

        {/* Description */}
        {prompt.description && (
          <div className="text-xl text-muted-foreground mb-8 leading-relaxed prose prose-lg prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {prompt.description}
            </ReactMarkdown>
          </div>
        )}

        {/* Stats & Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/50">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="w-5 h-5" />
              <span className="font-medium">{viewCount}</span>
              <span className="hidden sm:inline">views</span>
            </div>
            {ratingCount > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">
                  {rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">({ratingCount})</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <CopyButton content={prompt.content} promptId={prompt.id} />
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Prompt Content</h2>
        </div>
        <div className="rounded-xl p-6 bg-card border border-border/50 shadow-inner">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {prompt.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {prompt.instructions && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">How to Use</h2>
          </div>
          <div className="prose prose-invert max-w-none leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {prompt.instructions}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Example Output */}
      {prompt.exampleOutput && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Lightbulb className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Example Output</h2>
          </div>
          <div className="rounded-xl p-6 bg-card border border-border/50 shadow-inner">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {prompt.exampleOutput}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Author Info */}
      {prompt.user && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold mb-6">About the Author</h2>
          <div className="flex items-center gap-4">
            {prompt.user.image && (
              <img
                src={prompt.user.image}
                alt={prompt.user.name || "User"}
                className="w-16 h-16 rounded-full ring-2 ring-primary/20"
              />
            )}
            <div>
              <div className="text-lg font-semibold">
                {prompt.user.name || prompt.user.username || "Anonymous"}
              </div>
              {prompt.user.username && (
                <div className="text-sm text-muted-foreground">
                  @{prompt.user.username}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
