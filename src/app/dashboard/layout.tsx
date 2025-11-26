export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <div className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                </div>
            </div>
            <div className="container mx-auto px-4 py-8">{children}</div>
        </div>
    );
}
