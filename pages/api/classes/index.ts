import ctx from "@/server/context/container";

export default ctx.resolve('ClassesController').handler('/api/classes')