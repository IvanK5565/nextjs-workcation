//subjects
import { NextApiRequest, NextApiResponse } from "next";
import { QueryTypes } from "sequelize";
import { db } from "@/pages/api/db";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();


router.get(async (req, res) => {
    const subjects = await db.query("SELECT * FROM subjects LIMIT 10", { type: QueryTypes.SELECT });
    res.status(200).json(subjects);
  })
  .post((req,res) => {
    const data = req.body;
    console.log("post in subjects:"+data);
    
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