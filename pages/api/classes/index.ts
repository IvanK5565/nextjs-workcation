//classes
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import ctx from "@/server/container";

export const router = createRouter<NextApiRequest, NextApiResponse>();
router
  .use(async (req, res, next) => {
    await ctx.resolve('sequelize').authenticate();
    next();
  })
  .get(async (req, res) => {
    const result = await ctx.resolve('ClassesController').Get(req,res);
    res.status(200).json(result);
  })
  .post(async (req, res) => {
    const result = await ctx.resolve('ClassesController').Post(req,res);
    res.status(200).json(result);
  })
  .all((req, res) => {
    res.status(405).json({
      error: "Method not allowed",
    });
  });

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({
      error: (err as Error).message,
    });
  },
});