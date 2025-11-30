import { getAllCategories, getAllAIModels } from "@/db/queries/admin";
import { createCategory, deleteCategory, createAIModel, deleteAIModel } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const [categories, aiModels] = await Promise.all([
        getAllCategories(),
        getAllAIModels(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Taxonomy Management</h1>
                <p className="text-muted-foreground">Manage categories and AI models</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Categories */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Categories ({categories.length})</CardTitle>
                        <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        {category.color && (
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: category.color }}
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium">{category.name}</div>
                                            <div className="text-xs text-muted-foreground">{category.slug}</div>
                                        </div>
                                    </div>
                                    <form action={deleteCategory.bind(null, category.id)}>
                                        <Button type="submit" variant="ghost" size="sm">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* AI Models */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>AI Models ({aiModels.length})</CardTitle>
                        <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {aiModels.map((model) => (
                                <div
                                    key={model.id}
                                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                                >
                                    <div>
                                        <div className="font-medium">{model.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {model.provider || "Unknown"} • {model.slug}
                                        </div>
                                    </div>
                                    <form action={deleteAIModel.bind(null, model.id)}>
                                        <Button type="submit" variant="ghost" size="sm">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
