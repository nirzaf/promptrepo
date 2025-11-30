import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Moderation Queue</h1>
                <p className="text-muted-foreground">Review and manage reported content</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        Pending Reports
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No pending reports at this time.</p>
                        <p className="text-sm mt-2">
                            Reports will appear here when users flag content for review.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Moderation Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p>• Review all reported content within 24 hours</p>
                        <p>• Take appropriate action based on community guidelines</p>
                        <p>• Document decisions for transparency</p>
                        <p>• Communicate with users when necessary</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
