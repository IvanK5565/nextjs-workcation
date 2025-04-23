import ctx from "@/server/container";
import { FormEvent } from "react";
import 'reflect-metadata';
import type { Classes as Class } from "@/server/models/classes";
import type { Users as User } from "@/server/models/users";
import Button from "@/components/ui/button";


export default function Home({
  teachers,
  _class
}: { teachers: User[], _class: Class }) {
  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const id = formData.get('class_id')?.toString();
    console.log(JSON.parse(JSON.stringify(data)));
    
    await fetch(`/api/classes/${id}`,{
      method:'POST',
      body:JSON.parse(JSON.stringify(data)),
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

export const getServerSideProps = ctx.resolve('getServerSideProps')(
  '/classes/[id]',
  ['ClassesController', 'UsersController'])
