//users_in_class
import { NextApiRequest, NextApiResponse } from "next";
import sequelize from "@/utils/db";
import { createRouter } from "next-connect";
import User_classes from "@/models/user_classes";
import Users from "@/models/users";
import Classes from "@/models/classes";

const router = createRouter<NextApiRequest, NextApiResponse>();


router.use(async (req,res,next)=>{
  await sequelize.authenticate();
  next();
})
.get(async (req, res) => {
    const { class_id, student_id, limit, page } = req.query;
    const limit_n = Number.parseInt(limit as string);
    const page_n = Number.parseInt(page as string);

    const filters: { [key: string]: any } = {};
    const where: { [key: string]: any } = {};

    if (class_id) { where.class_id = class_id}
    if (student_id) { where.student_id = student_id}
    
    if (where) { filters.where = where; }
    if (limit_n) { filters.limit = limit_n; }
    if (limit_n && page_n) {
      filters.limit = limit_n;
      filters.offset = limit_n * (page_n - 1);
    }
    // filters.include = [Users,Classes];

    const results = await User_classes.findAll(filters);
    res.status(200).json(results);
  })
  .post(async (req,res) => {
    const data = req.body;
    console.log("post in users_in_class:"+req.body);
    const { teacher_id, title, year, status } = req.body;
    const createdUser = await Users.create({
      teacher_id: teacher_id,
      title: title,
      year: year,
      status: status,
    })
    
    res.status(200).json({message:"ALLDONE", createdUser});
    return
  })
  .delete(async (req, res) => {
    console.log("delete in classes/id:");

    const destroyed = await User_classes.destroy({
      where: {
        user_classes_id: req.query.id,
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