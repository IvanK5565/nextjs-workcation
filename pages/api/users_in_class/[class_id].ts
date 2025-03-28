//users_in_class/class_id
import type { NextApiRequest, NextApiResponse } from 'next'
import { QueryTypes } from "sequelize";
import { db } from '@/pages/api/db';
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();


router.get(async (req, res) => {
    const users = await db.query(`SELECT * FROM \`USER_CLASSES\` WHERE class_id=${req.query.class_id}`, { type: QueryTypes.SELECT });
    res.status(200).json(users);
  })
  .put((req, res) => {
    const data = req.body;
    console.log("put in users_in_class/id:"+data);
    return;
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