import Link from "next/link";
import { CommandPalette } from "@/components/search/command-palette";

export function Navbar() {
    return (
        <nav className="border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        PromptVault
                    </Link>

                    <div className="flex items-center gap-6">
                        <CommandPalette />

                        <div className="hidden md:flex items-center gap-6">
                            <Link
                                href="/explore"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Explore
                            </Link>
                            <Link
                                href="/categories"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Categories
                            </Link>
                            <Link
                                href="/dashboard/prompts/new"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
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
