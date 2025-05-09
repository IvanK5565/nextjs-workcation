import ctx from "@/server/context/container";

export default ctx.resolve('UsersController').handler('/api/login')