// import { NextApiRequest, NextApiResponse } from 'next'
// import { createRouter } from "next-connect";
import ctx from '@/server/context/container'

const controller = ctx.resolve("UserClassesController");

// export const router = createRouter<NextApiRequest, NextApiResponse>();
// router
//   .get(controller.getUsersInOneClass.bind(controller))
//   .post(controller.update.bind(controller))
//   .delete(controller.delete.bind(controller))
//   .all((_, res) => {
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

export default controller.handler('/api/usersInClass/[id]');