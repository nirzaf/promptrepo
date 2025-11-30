import { getAllPrompts } from "@/db/queries/admin";
import { updatePromptStatus, deletePrompt } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Archive, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
    const prompts = await getAllPrompts(1, 100);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Prompt Management</h1>
                <p className="text-muted-foreground">Manage all prompts across the platform</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Prompts ({prompts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Title</th>
                                    <th className="text-left p-2">Author</th>
                                    <th className="text-left p-2">Status</th>
                                    <th className="text-left p-2">Visibility</th>
                                    <th className="text-left p-2">Stats</th>
                                    <th className="text-left p-2">Created</th>
                                    <th className="text-right p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prompts.map((prompt) => (
                                    <tr key={prompt.id} className="border-b hover:bg-muted/50">
                                        <td className="p-2">
                                            <Link
                                                href={`/prompt/${prompt.slug}`}
                                                className="font-medium hover:text-primary"
                                            >
                                                {prompt.title}
                                            </Link>
                                            {prompt.description && (
                                                <div className="text-xs text-muted-foreground line-clamp-1">
                                                    {prompt.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-2 text-sm">
                                            {prompt.user?.name || prompt.user?.email || "Guest"}
                                        </td>
                                        <td className="p-2">
                                            <Badge
                                                variant={
                                                    prompt.status === "published" ? "default" :
                                                        prompt.status === "draft" ? "secondary" :
                                                            "outline"
                                                }
                                            >
                                                {prompt.status}
                                            </Badge>
                                        </td>
                                        <td className="p-2">
                                            <Badge variant="outline">{prompt.visibility}</Badge>
                                        </td>
                                        <td className="p-2 text-sm">
                                            <div className="flex gap-2">
                                                <span>👁 {prompt.viewCount || 0}</span>
                                                <span>⭐ {prompt.ratingAvg || 0}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 text-sm">
                                            {prompt.createdAt ? new Date(prompt.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="p-2">
                                            <div className="flex gap-1 justify-end">
                                                <PromptActionButtons prompt={prompt} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function PromptActionButtons({ prompt }: { prompt: any }) {
    return (
        <>
            {prompt.status !== "published" && (
                <form action={updatePromptStatus.bind(null, prompt.id, "published")}>
                    <Button type="submit" variant="ghost" size="sm" title="Publish">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    </Button>
                </form>
            )}
            {prompt.status !== "archived" && (
                <form action={updatePromptStatus.bind(null, prompt.id, "archived")}>
                    <Button type="submit" variant="ghost" size="sm" title="Archive">
                        <Archive className="w-4 h-4" />
                    </Button>
                </form>
            )}
            <form action={deletePrompt.bind(null, prompt.id)}>
                <Button type="submit" variant="ghost" size="sm" title="Delete">
                    <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
            </form>
        </>
    );
}
