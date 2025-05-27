import ctx from "@/server/container/container"
import NextAuth from "next-auth"

export default NextAuth(ctx.resolve("authOptions"))