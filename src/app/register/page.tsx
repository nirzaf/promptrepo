"use client";

import { useActionState } from "react";
import { register } from "@/actions/register";
import Link from "next/link";

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(register, undefined);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-md">
                <div className="glass gradient-border rounded-xl p-8">
                    <h1 className="text-3xl font-bold mb-2">Create an account</h1>
                    <p className="text-muted-foreground mb-6">
                        Join PromptVault to share and discover amazing prompts.
                    </p>

                    <form action={action} className="space-y-4">
                        {/* Global Error */}
                        {state?.error && "root" in state.error && state.error.root && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-sm">
                                {state.error.root}
                            </div>
                        )}

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="John Doe"
                            />
                            {state?.error && "name" in state.error && state.error.name && (
                                <p className="text-xs text-red-500">{state.error.name}</p>
                            )}
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="johndoe"
                            />
                            {state?.error && "username" in state.error && state.error.username && (
                                <p className="text-xs text-red-500">{state.error.username}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="m@example.com"
                            />
                            {state?.error && "email" in state.error && state.error.email && (
                                <p className="text-xs text-red-500">{state.error.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="••••••••"
                            />
                            {state?.error && "password" in state.error && state.error.password && (
                                <p className="text-xs text-red-500">{state.error.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isPending ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
