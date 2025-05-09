// import { NextApiRequest, NextApiResponse } from 'next'
// import { createRouter } from "next-connect";
import ctx from '@/server/context/container'

const controller = ctx.resolve('UsersController');

// export const router = createRouter<NextApiRequest, NextApiResponse>();
// router
//   .get(controller.findById)
//   .post(controller.save.bind(controller))
//   .delete(controller.deleteById.bind(controller))
//   .all((req, res) => {
//     res.status(405).json({
//       error: "Method not allowed",
//     });
//   });

// export default router.handler({
//   onError: (err, req, res) => {
//     res.status(500).json({
//       error: (err as Error).message,
//     });
//   },
// });

export default controller.handler('/api/users/[id]')
