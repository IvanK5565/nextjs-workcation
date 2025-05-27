import ctx from "@/server/container/container"

const controller = ctx.resolve("UserClassesController");

export default controller.handler('/api/usersInClass')