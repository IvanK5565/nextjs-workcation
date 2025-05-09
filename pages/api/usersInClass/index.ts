import ctx from "@/server/context/container"

const controller = ctx.resolve("UserClassesController");

export default controller.handler('/api/usersInClass')