import ctx from "@/server/container";

const controller = ctx.resolve('ClassesController');

// export default controller.handler('/api/classes/[id]');
export default controller.handler();