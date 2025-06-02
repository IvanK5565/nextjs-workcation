
import ctx from '@/server/container/container'

const controller = ctx.resolve('UsersController');
export default controller.handler()
