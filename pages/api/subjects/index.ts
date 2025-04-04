//subjects
import { NextApiRequest, NextApiResponse } from "next";
import ctx from "@/server/container";
import { createRouter } from "next-connect";

export const router = createRouter<NextApiRequest, NextApiResponse>();
router
  .use(async (req, res, next) => {
    console.log("subjects/id");
    await ctx.resolve('sequelize').authenticate();
    next();
  })
  .get(async (req, res) => {
    const result = await ctx.resolve('SubjectsController').Get(req, res);
    res.status(200).json(result);
  })
  .post(async (req, res) => {
    const result = await ctx.resolve('SubjectsController').Post(req, res);
    res.status(200).json(result);
  })
  .all((_req, res) => {
    res.status(405).json({
      error: "Method not allowed",
    });
  });
export default router.handler({
  onError: (err, _req, res) => {
    res.status(500).json({
      error: (err as Error).message,
    });
  },
});