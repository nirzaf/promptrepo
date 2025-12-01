import { auth } from "@/lib/auth";

export { auth as proxy };

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
