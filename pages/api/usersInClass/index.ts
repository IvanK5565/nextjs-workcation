import ctx from "@/server/container"

const controller = ctx.resolve("UserClassesController");

export default controller.handler('/api/usersInClass')