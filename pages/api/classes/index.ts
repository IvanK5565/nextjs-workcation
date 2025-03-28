//classes
import { NextApiRequest, NextApiResponse } from "next";
import { QueryTypes } from "sequelize";
import { db } from "@/pages/api/db";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();


router.get(async (req, res) => {
    const classes = await db.query("SELECT * FROM classes", { type: QueryTypes.SELECT });
    res.status(200).json(classes);
  })
  .post((req,res) => {
    const data = req.body;
    console.log("post in classes:"+data);
    
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