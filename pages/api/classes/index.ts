//classes
import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import sequelize from "@/utils/db";
import { createRouter } from "next-connect";
import Classes from "@/models/classes";

export const router = createRouter<NextApiRequest, NextApiResponse>()
  .use(async (req, res, next) => {
    await sequelize.authenticate();
    next();
  })
  .get(async (req, res) => {
    const { title, status, teacher_id, limit, page } = req.query;
    const filters: { [key: string]: any } = {};
    const where: { [key: string]: any } = {};

    if (title) {
      where.title = {
        [Op.like]: `%${title}%`, // Search for names containing the query string
      };
    }
    if (status) { where.status = status; }
    if (teacher_id) { where.teacher_id = teacher_id; }
    if (where) { filters.where = where; }
    const limit_n = Number.parseInt(limit as string);
    const page_n = Math.max(1, Number.parseInt(page as string));

    if (limit_n) { filters.limit = limit_n; }
    if (limit_n && page_n) {
      filters.limit = limit_n;
      filters.offset = limit_n * (page_n - 1);
    }

    const results = await Classes.findAll(filters)
    console.log(filters);
    console.log("limit: " + limit);
    console.log("page: " + page);

    res.status(200).json(results);
  })
  .post(async (req, res) => {
    console.log("post in classes:" + req.body);
    const { teacher_id, title, year, status } = req.body;
    const createdClass = await Classes.create({
      teacher_id: teacher_id,
      title: title,
      year: year,
      status: status,
    })

    res.status(200).json({ message: "CREATED", createdClass });
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