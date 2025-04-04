//users_in_class/class_id
import type { NextApiRequest, NextApiResponse } from 'next'
import sequelize from '@/utils/db';
import { createRouter } from "next-connect";
import Users from '@/server/models/users';
import Classes from '@/server/models/classes';

const router = createRouter<NextApiRequest, NextApiResponse>();


router.use(async (req,res,next)=>{
  await sequelize.authenticate();
  next();
})
.get(async (req, res) => {
    //const users = await sequelize.query(`select u.* from users u join user_classes uc ON u.user_id = uc.student_id where uc.class_id = ${req.query.class_id}`, { type: QueryTypes.SELECT });
    const users = await Users.findAll({
      include:[
        {
          model: Classes,
          // through: {attributes: []},
          as: 'student_classes',
          where: {class_id:req.query.class_id,}
        },
      ]
    })
    res.status(200).json(users);
  })
  .post(async (req, res) => {
    console.log(`post in users_in_class/${req.query.class_id}:`);
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
  .all((_, res) => {
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