import { useState } from "react";
import Button from "../ui/button";

export default function Register({className, onLogin}:{className?:string, onLogin:Function}) {
  const [myState, setState] = useState(false);
  return <div className={className?className:""}>
    <h1 className="mt-8 lg:mt-12 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
      Create your account.
    </h1>
    <form className="flex flex-col">
      <label htmlFor="login" className="mt-4 text-2xl text-indigo-500 font-bold leading-tight">Email</label>
      <input className="rounded-lg" type="text" name="email" id="login" placeholder="example@email.com" />
      <label htmlFor="password" className="mt-2 text-2xl text-indigo-500 font-bold leading-tight">Password</label>
      <input className="rounded-lg" type="password" name="password" id="password" placeholder="Password" />
      <span onClick={()=>{onLogin()}} className="mt-2 text-indigo-500 underline text-sm cursor-pointer h-min">Already have an account?</span>
    <div className="flex flex-row-reverse justify-between">
      <Button type="submit">Confirm</Button>
    </div>
    </form>
  </div>
}