import Link from "next/link";
import { Star, Copy, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PromptCardProps = {
    prompt: {
        id: string;
        slug: string;
        title: string;
        description: string | null;
        viewCount: number | null;
        copyCount: number | null;
        ratingAvg: string | null;
        ratingCount: number | null;
        user: {
            name: string | null;
            username: string | null;
            image: string | null;
        } | null;
        category: {
            name: string;
            slug: string;
            color: string | null;
        } | null;
    };
};

export function PromptCard({ prompt }: PromptCardProps) {
    const rating = prompt.ratingAvg ? parseFloat(prompt.ratingAvg) : 0;
    const viewCount = prompt.viewCount || 0;
    const copyCount = prompt.copyCount || 0;
    const ratingCount = prompt.ratingCount || 0;

    return (
        <Link href={`/prompt/${prompt.slug}`} className="block group">
            <Card className="p-6 backdrop-blur-[2px] hover:bg-card/92 hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.01] ring-1 ring-border/60 hover:ring-primary/50">
                {/* Category Badge */}
                {prompt.category && (
                    <div className="mb-3">
                        <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: prompt.category.color
                                    ? `${prompt.category.color}55`
                                    : "var(--color-muted)",
                                color: "var(--color-card-foreground)",
                            }}
                        >
                            {prompt.category.name}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 drop-shadow-[0_1px_8px_rgba(255,255,255,0.06)]">
                    {prompt.title}
                </h3>

                {/* Description */}
                {prompt.description && (
                    <div className="text-card-foreground/80 mb-4 line-clamp-2 drop-shadow-[0_1px_6px_rgba(255,255,255,0.05)] prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {prompt.description}
                        </ReactMarkdown>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Copy className="w-4 h-4" />
                        <span>{copyCount}</span>
                    </div>
                    {ratingCount > 0 && (
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{rating.toFixed(1)}</span>
                            <span className="text-xs">({ratingCount})</span>
                        </div>
                    )}
                </div>

                {/* Author */}
                {prompt.user && (
                    <div className="flex items-center gap-2 text-sm">
                        {prompt.user.image && (
                            <img
                                src={prompt.user.image}
                                alt={prompt.user.name || "User"}
                                className="w-6 h-6 rounded-full"
                            />
                        )}
                        <span className="text-muted-foreground">
                            by {prompt.user.name || prompt.user.username || "Anonymous"}
                        </span>
                    </div>
                )}
            </Card>
        </Link>
    );
}
