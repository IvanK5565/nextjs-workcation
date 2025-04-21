import ctx from "@/server/container";
import { IncomingMessage } from "http";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { FormEvent } from "react";
import 'reflect-metadata';
import { Classes as Class } from "@/server/models/classes";
import { Users as User } from "@/server/models/users";
import Button from "@/components/ui/button";


export default function Home({
  teachers,
  _class
}: { teachers: User[], _class: Class }) {
  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const id = data.get('class_id')?.toString();
    console.log(id);
    
    await fetch(`/api/classes/${id}`,{
      method:'POST',
      body:data,
    })
  }
  return <>
    <div>
      <p className="pl-10">id:{_class.class_id}</p>
      <form onSubmit={handleSubmit} className="flex flex-col w-min pl-10">
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
        <Button type="submit" className="border mt-5">Submit</Button>
      </form>
    </div>
  </>
}



// export const getServerSideProps = (async (context:GetServerSidePropsContext) => {
//   const { res, query } = context
//   const req = context.req as SSRRequest;
//   req.query = query;
  
//   const handler = ctx.resolve('ClassesController').handlerSSR('classes/[id]');
//   const result = await handler(req as any,res as any) as {props:any};
//   return result;
// })satisfies GetServerSideProps;

export const getServerSideProps = ctx.resolve('getServerSideProps')(
  'classes/[id]',
  ['ClassesController', 'UsersController'])
