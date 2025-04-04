import type { NextApiRequest, NextApiResponse } from 'next'
import { QueryTypes } from "sequelize";
import sequelize from '@/utils/db';
import { createRouter } from "next-connect";
import Users from '@/models/users';

const router = createRouter<NextApiRequest, NextApiResponse>();


router.use(async (req,res,next)=>{
  await sequelize.authenticate();
  next();
})
.get(async (req, res) => {
  const users: Users[] = await Users.findAll({
    where: {
      user_id: req.query.id,
    }
  });
  res.status(200).json(users[0]);
  return users;
})
.post(async (req,res)=>{
  console.log("post in classes/id:");
  console.log(req.body);

  const { first_name, last_name, role, status } = req.body;

    const fields: { [key: string]: any } = {};

    if (first_name) { fields.name = first_name; }
    if (last_name)  { fields.last_name = last_name; }
    if (role)       { fields.role = role; }
    if (status)     { fields.status = status; }

  console.log(fields); 
  const updatedUser = await Users.update(fields, 
  {
    where: {
      class_id: req.query.id,
    }
  })

  res.status(200).json(updatedUser);
})
.delete(async (req, res) => {
  console.log("delete in users/id:");

  const destroyed = await Users.destroy({
    where: {
      user_id: req.query.id,
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
