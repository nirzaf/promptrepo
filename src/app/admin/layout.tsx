import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Users, FileText, FolderTree, AlertTriangle } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-background">
            <aside className="w-64 border-r bg-muted/40 p-6 space-y-6">
                <div className="flex items-center gap-2 mb-8">
                    <Shield className="w-6 h-6 text-primary" />
                    <h2 className="font-bold text-xl">Admin Portal</h2>
                </div>
                <nav className="flex flex-col gap-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Shield className="w-4 h-4" />
                        Overview
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        Users
                    </Link>
                    <Link
                        href="/admin/prompts"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Prompts
                    </Link>
                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <FolderTree className="w-4 h-4" />
                        Taxonomy
                    </Link>
                    <Link
                        href="/admin/reports"
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-red-500 hover:text-red-600"
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Moderation
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
