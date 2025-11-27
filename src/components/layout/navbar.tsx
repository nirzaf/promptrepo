import Link from "next/link";
import { CommandPalette } from "@/components/search/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">PromptVault</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <CommandPalette />
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">
                                Explore
                            </Link>
                            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
                                Categories
                            </Link>
                            <ThemeToggle />
                            <Link href="/dashboard/prompts/new" className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/90">
                                Submit Prompt
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
