import React, { FormEvent } from "react"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest, NextApiResponse } from "next"
import { Class, User } from "@/pages/api/data";
import { createRouter } from "next-connect";
import 'reflect-metadata'
import ctx from "@/server/container";
import Board from "@/components/temp/board";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { FilterType } from "@/server/constants";

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
        <button type="submit" className="border">Submit</button>
      </form>
    </div>
  </>
}

type SSRRequest = IncomingMessage & 
{ 
  query?:Partial<{[key: string]: string | string[];}>,
}

export const getServerSideProps = (async (context:GetServerSidePropsContext) => {
  const { res, query } = context

  const req = context.req as SSRRequest;
  req.query = query;
  
  const controller = ctx.resolve('ClassesController');
  // const _router = createRouter<SSRRequest,NextApiResponse>();
  // .get(controller.getClassByIdAndTeachersSSR.bind(controller))
  // return (await router.run(req, res)) as GetServerSidePropsResult<{ props:{teachers: User[], _class: Class} }>;


  const handler = controller.handlerSSR('classes/[id]');
  const result = await handler(req as any,res as any) as {props:any};
  return result;
})satisfies GetServerSideProps;

