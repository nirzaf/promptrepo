import Link from "next/link";
import { CommandPalette } from "@/components/search/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b glass">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold tracking-tight group">
                        <span className="text-gradient transition-all duration-300">
                            PromptVault
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <CommandPalette />
                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/explore"
                                className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                            >
                                Explore
                            </Link>
                            <Link
                                href="/categories"
                                className="text-sm font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                            >
                                Categories
                            </Link>
                            <ThemeToggle />
                            <Link
                                href="/dashboard/prompts/new"
                                className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all hover:shadow-lg hover:scale-105"
                            >
                                Submit Prompt
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
