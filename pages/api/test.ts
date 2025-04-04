import '@/utils/db';
import Users from '@/models/users';
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import Classes from '@/models/classes';

const router = createRouter<NextApiRequest, NextApiResponse>();


router.get(async (req, res) => {
  await Classes.update(
    {year: 2013},
    {
      where: {
        year:2020
      }
    }
  )
  const results: Classes[] = await Classes.findAll({
    include: Users,
  });
  res.status(200).json(results);
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