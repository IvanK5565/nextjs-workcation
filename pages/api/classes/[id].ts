//classes
import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/utils/db";
import { createRouter } from "next-connect";
import Classes from "@/models/classes";

export const router = createRouter<NextApiRequest, NextApiResponse>()
  .use(async (req, res, next) => {
    await sequelize.authenticate();
    next();
  })
  .get(async (req, res): Promise<Classes[]> => {
    sequelize.authenticate();
    const classes: Classes[] = await Classes.findAll({
      where: {
        class_id: req.query.id,
      }
    });
    res.status(200).json(classes);
    return classes;
  })
  .post(async (req, res) => {
    console.log("put in classes/id:");
    console.log(req.body);

    const { title, status, teacher_id } = req.body;
    const fields: { [key: string]: any } = {};

    if (title) { fields.title = title; }
    if (status) { fields.status = status; }
    if (teacher_id) { fields.teacher_id = teacher_id; }


    const updatedClass = await Classes.update(fields, 
    {
      where: {
        class_id: req.query.id,
      }
    })
    console.log(fields);

    res.status(200).json(updatedClass);
  })
  .delete(async (req, res) => {
    console.log("delete in classes/id:");

    const destroyed = await Classes.destroy({
      where: {
        class_id: req.query.id,
      }
    })
    res.status(200).json({ status: `deleted ${destroyed} rows`, deleted: destroyed });
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