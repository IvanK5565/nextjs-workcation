import ctx from "@/server/container";

export default ctx.resolve('UsersController').handler('/api/login')