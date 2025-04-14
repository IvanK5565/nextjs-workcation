import { useState } from "react"

export default function Home(props: {}) {
  const [data, setData] = useState({});
  const [input, setInput] = useState('2');

  const buttonStyle = 'border ml-4 p-2'
  function onClick(url:string){
    return async function(){
      let data = await fetch(url,{
        method: "GET"
      });
      setData(await data.json());
    }
  }
  return <div>
    <nav className="flex justify-between mt-2">
      <input className={buttonStyle} onChange={(e)=>setInput(e.target.value)} onFocus={(e)=>e.target.value = ""} type="text" />
      <button className={buttonStyle} onClick={onClick(`api/classes/${input}`)}>api/classes/{input}</button>
      <button className={buttonStyle} onClick={onClick(`api/classes`)}>api/classes</button>
      <button className={buttonStyle} onClick={onClick(`api/users/${input}`)}>api/users/{input}</button>
      <button className={buttonStyle} onClick={onClick(`api/users`)}>api/users</button>
      <button className={buttonStyle} onClick={onClick(`api/subjects/${input}`)}>api/subjects/{input}</button>
      <button className={buttonStyle} onClick={onClick(`api/subjects`)}>api/subjects</button>
      <button className={buttonStyle} onClick={onClick(`api/usersInClass/${input}`)}>api/usersInClass/{input}</button>
      <button className={buttonStyle} onClick={onClick(`api/usersInClass`)}>api/usersInClass</button>
    </nav>
    <pre className="border mt-1">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
}