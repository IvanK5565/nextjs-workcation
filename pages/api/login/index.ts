import ctx from "@/server/container/container";

export default ctx.resolve('UsersController').handler('/api/login')