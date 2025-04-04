import React from "react"
import { NextApiRequest, NextApiResponse } from "next"
import { Class, User } from "@/pages/api/data";
import { createRouter } from "next-connect";
import 'reflect-metadata'
import ctx from "@/server/container";

export function getServerSideProps(context: any) {
  const { req, res, params } = context;
  req.query = {id:params.id};
  
  console.log('---------------------------------------------');
  console.log(params);

  const router = createRouter<NextApiRequest, NextApiResponse>()
  .use(async (_req,_res,next)=>{
    await ctx.resolve("sequelize").authenticate();
    next();
  })
    .get(async (req, res) => {
      const _class = await ctx.resolve('ClassesController').GetById(req,res);
      
      req.query.role='teacher';
      const teachers = await ctx.resolve('UsersController').Get(req,res);

      return { props: { 
        _class: JSON.parse(JSON.stringify(_class)),
        teachers: JSON.parse(JSON.stringify(teachers)) }
      };

    })
    .post(
      // async (req, res, next) => {
      //   req.body = await new Promise((resolve, reject) => {
      //     let body = "";
      //     req.on("error", reject);
      //     req.on("data", (chunk) => (body += chunk));
      //     req.on("end", () => {
      //       const searchParams = new URLSearchParams(body);
      //       const result: Record<string, string> = {};
      //       for (const [key, value] of searchParams) {
      //         result[key] = value;
      //       }
      //       resolve(result);
      //     });
      //   });

      //   return next();
      // },
      async (req, res) => {
        const { class_id, title, teacher, status, year } = req.body!;
        console.log(req.body)
        // const result = await sequelize.query(`UPDATE classes SET
        //   teacher_id = ${teacher},
        //   title = '${title}',
        //   year = ${year},
        //   status = '${status}'
        //   WHERE class_id = ${class_id};
        //   `, { type: QueryTypes.UPDATE });
        // console.log(result);

        // return result;
      }
    )
  return router.run(req, res);
};

export default function Home({
  teachers,
  _class
}: { teachers: User[], _class: Class }) {
  return <>
    <div>
      <p className="pl-10">id:{_class.class_id}</p>
      <form method="POST" className="flex flex-col w-min pl-10">
        <input type="hidden" name="class_id" className="block" defaultValue={_class.class_id} />
        <input type="text" name="title" className="" defaultValue={_class.title} required />
        <select name="teacher" id="teacher" defaultValue={_class.teacher_id} required>
          <option value="">Teacher</option>
          {teachers.map((t, i) => (
            <option key={i} value={t.user_id}
            >{t.last_name} {t.role}</option>
          ))}
        </select>
        <select name="status" id="status" defaultValue={_class.status} required>
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
        <input type="number" name="year" defaultValue={_class.year} required />
        <button type="submit" className="border">Submit</button>
      </form>
    </div>
  </>
}