import ctx from "@/server/context/container"

const controller = ctx.resolve('UsersController');

export default controller.handler('/api/register');
