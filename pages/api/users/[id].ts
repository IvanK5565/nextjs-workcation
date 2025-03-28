import type { NextApiRequest, NextApiResponse } from 'next'
import { QueryTypes } from "sequelize";
import { db } from '@/pages/api/db';
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();


router.get(async (req, res) => {
    const users = await db.query(`SELECT * FROM \`USERS\` WHERE \`user_id\`=${req.query.id}`, { type: QueryTypes.SELECT });
    res.status(200).json(users[0]);
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
