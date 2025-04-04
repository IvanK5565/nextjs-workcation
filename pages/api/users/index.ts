//users
import { NextApiRequest, NextApiResponse } from "next";
import { Op, QueryTypes } from "sequelize";
// import sequelize from "@/utils/db";
import container from "@/utils/container";
import { createRouter } from "next-connect";
import { User } from "../data";
import Users from "@/models/users";

const router = createRouter<NextApiRequest, NextApiResponse>();
const sequelize = container.resolve('sequelize');

router.use(async (req, res, next) => {
  await sequelize.authenticate();
  next(); // call next in chain
})
  .get(async (req, res) => {
    const { first_name, last_name, email, role, status, limit, page } = req.query;
    const limit_n = Number.parseInt(limit as string);
    const page_n = Number.parseInt(page as string);

    const filters: { [key: string]: any } = {};
    const where: { [key: string]: any } = {};

    if (first_name) {
      where.first_name = {
        [Op.like]: `%${first_name}%`,
      };
    }
    if (last_name) {
      where.last_name = {
        [Op.like]: `%${last_name}%`,
      };
    }
    if (email) {
      where.email = {
        [Op.like]: `%${email}%`,
      };
    }
    if (role) where.role = role;
    if (status) where.status = status;
    if (where) { filters.where = where; }
    if (limit_n) { filters.limit = limit_n; }
    if (limit_n && page_n) {
      filters.limit = limit_n;
      filters.offset = limit_n * (page_n - 1);
    }

    const users = await Users.findAll(filters);
    res.status(200).json(users);
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