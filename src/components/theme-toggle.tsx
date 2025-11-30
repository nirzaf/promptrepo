"use client";

import * as React from "react";
import { Moon, Sun, Contrast } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const getIcon = () => {
        if (theme === "high-contrast") return <Contrast className="h-[1.2rem] w-[1.2rem]" />;
        if (theme === "dark") return <Moon className="h-[1.2rem] w-[1.2rem]" />;
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative transition-all duration-300"
                    aria-label="Toggle theme"
                >
                    {getIcon()}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="cursor-pointer"
                >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {theme === "light" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="cursor-pointer"
                >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {theme === "dark" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("high-contrast")}
                    className="cursor-pointer"
                >
                    <Contrast className="mr-2 h-4 w-4" />
                    <span>High Contrast</span>
                    {theme === "high-contrast" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
