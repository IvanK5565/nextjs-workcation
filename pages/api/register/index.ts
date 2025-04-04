//users
import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import sequelize from "@/utils/db";
import { createRouter } from "next-connect";
import Users from "@/server/models/users";

const router = createRouter<NextApiRequest, NextApiResponse>();


router.use(async (req, res, next) => {
  await sequelize.authenticate();
  next(); // call next in chain
})
  .post(async (req, res) => {
    console.log("register:" + req.body);
    const user = Users.build(req.body);
    try {
      await user.validate();
      await user.save();
      res.status(200).json([{ message: "Successfully" }]);
    } catch (error) {
      res.status(400).json(error);
    }
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