import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: "/signIn",
    // error: "/error",
  },
})

export const config = { matcher: [
  "/admin/:path*",
  "/",
  "/classes/:path*",
] }