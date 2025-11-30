import { db } from "@/db";
import { users, prompts } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Star, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Parallel fetching for performance
    const [userStats, promptStats, ratingStats] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users),
        db.select({
            total: sql<number>`count(*)`,
            published: sql<number>`sum(case when status = 'published' then 1 else 0 end)`,
            draft: sql<number>`sum(case when status = 'draft' then 1 else 0 end)`,
        }).from(prompts),
        db.select({
            avgRating: sql<number>`avg(CAST(ratingAvg AS DECIMAL(10,2)))`,
            totalRatings: sql<number>`sum(ratingCount)`,
        }).from(prompts),
    ]);

    const userCount = userStats[0]?.count || 0;
    const totalPrompts = promptStats[0]?.total || 0;
    const publishedPrompts = promptStats[0]?.published || 0;
    const draftPrompts = promptStats[0]?.draft || 0;
    const avgRating = ratingStats[0]?.avgRating || 0;
    const totalRatings = ratingStats[0]?.totalRatings || 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">System Overview</h1>
                <p className="text-muted-foreground">Monitor key metrics and system health</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={userCount}
                    icon={<Users className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Prompts"
                    value={totalPrompts}
                    icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                    subtitle={`${publishedPrompts} published, ${draftPrompts} drafts`}
                />
                <StatsCard
                    title="Average Rating"
                    value={avgRating.toFixed(2)}
                    icon={<Star className="w-4 h-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Ratings"
                    value={totalRatings}
                    icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Activity feed coming soon...</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Database</span>
                                <span className="text-sm text-green-500">● Online</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Authentication</span>
                                <span className="text-sm text-green-500">● Active</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({
    title,
    value,
    icon,
    subtitle
}: {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    subtitle?: string;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </CardContent>
        </Card>
    );
}
