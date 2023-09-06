import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook/clerk"], // List of routes that should be accessible without authentication.
  ignoredRoutes: ["/api/webhook/clerk"], // list of routes that should be ignored by the middleware (i.e. static files, Next.js internals).
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
