import ctx from "@/server/container";

export default ctx.resolve('ClassesController').handler('/api/classes')