import ctx from "@/server/context/container"
import NextAuth from "next-auth"

export default NextAuth(ctx.resolve("authOptions"))