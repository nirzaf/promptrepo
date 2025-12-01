"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="glass gradient-border rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-2">Sign in</h1>
          <p className="text-muted-foreground mb-6">
            Welcome back! Please sign in to continue.
          </p>

          <form action={action} className="space-y-4">
            {/* Global Error */}
            {state?.error && "root" in state.error && state.error.root && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-sm">
                {state.error.root}
              </div>
            )}

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
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
