import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { db } from "@/pages/api/db";

type Class = {
  class_id: number,
  title: string,
}
type User_class = {
  user_class_id:number,
  class_id:number,
  student_id:number,
}

export const getServerSideProps = (async () =>{
  const [data] = await db.query(`SELECT user_id, first_name, last_name, email, password, role, status FROM USERS LIMIT 10`);
 return {props:{data:data}};
}) satisfies GetServerSideProps<{data:object}>;



export default function Home({
  data,
}:InferGetServerSidePropsType<typeof getServerSideProps>) {
  // console.log(data);
  
  const [selectedClass, setClass] = useState<number>();
  const [classes, setClasses] = useState<Class[]>([]);
  const [users, setUsers] = useState<[]>([]);
  
  useEffect(()=>{
    async function fetchClasses() {
      try{
        const response = await fetch('/api/classes');
        const results = await response.json();
        setClasses(results);
        return results;
      }
      catch(e){
        console.log(e);
      }
    }
    fetchClasses();
    if (data) {
      return
    }
  },[])

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
    <div>
      {(users as User_class[]).map((u,i) => (
        <div className="border-b flex justify-center" key={i}>
          <p className="border">{u.user_class_id}</p>
          <p className="border">{u.class_id}</p>
          <p className="border">{u.student_id}</p>
          </div>
      ))}
    </div>
    </>
  );
}

