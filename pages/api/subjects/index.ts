//subjects
import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import container from "@/utils/container";
import { createRouter } from "next-connect";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.use(async (req, res, next) => {
    await container.resolve('sequelize').authenticate();
    next();
  })
  .get(async (req, res) => {
    const { class_id, name, description, limit, page } = req.query;
    const limit_n = Number.parseInt(limit as string);
    const page_n = Math.max(1, Number.parseInt(page as string));

    const filters: { [key: string]: any } = {};
    const where: { [key: string]: any } = {};

    if(class_id) { where.class_id = class_id}
    if (name) {
      where.name = {
        [Op.like]: `%${name}%`, // Search for names containing the query string
      };
    }
    if (description) {
      where.description = {
        [Op.like]: `%${description}%`, // Search for names containing the query string
      };
    }
    if (where) { filters.where = where; }
    if (limit_n) { filters.limit = limit_n; }
    if (limit_n && page_n) {
      filters.limit = limit_n;
      filters.offset = limit_n * (page_n - 1);
    }

    const Subjects = container.resolve('SubjectsModel');
    const results = await Subjects.findAll(filters)
    res.status(200).json(results);
  })
  .post(async (req, res) => {
    const { name, description } = req.body;
    const Subjects = container.resolve('SubjectsModel');
    const createdClass = await Subjects.create({
      name: name,
      description: description,
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