//users
import { NextApiRequest, NextApiResponse } from "next";
import { Op, QueryTypes } from "sequelize";
import sequelize from "@/utils/db";
import { createRouter } from "next-connect";
import { User } from "../data";
import Users from "@/models/users";

const router = createRouter<NextApiRequest, NextApiResponse>();


router.use(async (req, res, next) => {
  await sequelize.authenticate();
  next(); // call next in chain
})
  .get(async (req, res) => {
    const { email, password } = req.query;
    const user = await Users.findOne({
      where: {
        email: email,
        password: password,
      }
    });
    res.status(200).json(user);
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