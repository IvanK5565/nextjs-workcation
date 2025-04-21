import ctx from "@/server/container"

const controller = ctx.resolve('UsersController');

export default controller.handler('api/register');
