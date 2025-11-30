import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith("/admin")) {
        const session = await auth();

        if (!session?.user) {
            // Not logged in, redirect to home
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (session.user.role !== "admin") {
            // Not an admin, redirect to home
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
