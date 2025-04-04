import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { User, Class } from "./api/data";
import { createRouter } from "next-connect";
import { QueryTypes } from "sequelize";
import { IncomingMessage, ServerResponse } from "http";
import container from "@/utils/container";
import Classes from "@/models/classes";
import { Sequelize } from "sequelize-typescript";

const router = createRouter<
IncomingMessage & { body?: Record<string, string> },
ServerResponse
>()
.get(async ()=>{
  const sequelize = container.resolve('sequelize') as Sequelize;
  sequelize.authenticate();
  // let sql = `SELECT class_id, teacher_id, title, year, status FROM classes WHERE status='active'`;
  // const classes = await sequelize.query(sql, { type: QueryTypes.SELECT });
  const classes = await Classes.findAll({
    attributes:['class_id','teacher_id','title','year', 'status'],
    where:{
      status:'active',
    },
  })
  return JSON.parse(JSON.stringify(classes));
})

export const getServerSideProps = (async ({req,res}) =>{
  const classes = await router.run(req,res) as Class[];
 return ({props:{classes}});
}) satisfies GetServerSideProps<{classes:Class[]}>;

export default function Home({
  classes,
}:InferGetServerSidePropsType<typeof getServerSideProps>) {
  
  const [selectedClass, setClass] = useState<number>();
  const [users, setUsers] = useState<[]>([]);


  useEffect(()=>{
    async function fetchClasses() {
      if(!selectedClass) return;
      try{
        const response = await fetch(`/api/users_in_class/${selectedClass}`);
        const results = await response.json();
        console.log(results);
        setUsers(results);
        return results;
      }
      catch(e){
        console.log(e);
      }
    }
    fetchClasses();
  },[selectedClass])
  
  return (
    <>
    <a href="workcation">go</a>
    <div>
      <select onChange={(e)=> setClass(Number(e.target.value))}>
        <option value="">null</option>
        {classes.map((cl,i) => (
          <option key={i} value={cl.class_id}>{cl.title}</option>
        ))}
      </select>
    </div>
    <div className="flex justify-between">
      {(users as User[]).map((u,i) => (
        <div className="border-b block w-full" key={i}>
          <p className="border">{u.user_id}</p>
          <p className="border">{u.last_name}</p>
          <p className="border">{u.first_name}</p>
          </div>
      ))}
    </div>
    </>
  );
}

