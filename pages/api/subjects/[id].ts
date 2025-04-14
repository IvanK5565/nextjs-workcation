import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import ctx from "@/server/container";

const controller = ctx.resolve("SubjectsController");

export const router = createRouter<NextApiRequest, NextApiResponse>();
router
  .get(controller.findById.bind(controller))
  .post(controller.save.bind(controller))
  .delete(controller.deleteById.bind(controller))
  .all((req, res) => {
    res.status(405).json({
      error: "Method not allowed",
    });
  });
// export default router.handler({
//   onError: (err, req, res) => {
//     res.status(500).json({
//       error: (err as Error).message,
//     });
//   },
// });

export default controller.handler('api/subjects/[id]');