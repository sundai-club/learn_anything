import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();
  const protectedRoutes = ["/temp"];

  // Only check authentication for protected routes
  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    // Redirect to home with sign-in trigger if not authenticated
    if (!userId) {
      const url = new URL("/", req.url);
      url.searchParams.set("sign-in", "true");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
