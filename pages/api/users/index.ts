//users
import { NextApiRequest, NextApiResponse } from "next";
import { QueryTypes } from "sequelize";
import { db } from "@/pages/api/db";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();


router.use(async (req, res, next) => {
    const start = Date.now();
    await next(); // call next in chain
    const end = Date.now();
    console.log(`Request took ${end - start}ms`);
  })
  .get(async (req, res) => {
    const users = await db.query("SELECT * FROM users LIMIT 10", { type: QueryTypes.SELECT });
    res.status(200).json(users);
  })
  .post((req,res) => {
    const data = req.body;
    console.log("post in users:"+data);
    
    res.status(200).json([{message:"ALLDONE"}]);
    return
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