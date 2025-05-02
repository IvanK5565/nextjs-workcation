import Button from "../ui/button";

export default function About({className, onLogin}:{className?:string, onLogin:()=>void}) {
  return <div className={className?className:""}>
    <h1 className="mt-8 lg:mt-12 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
      You can work from anywhere.
      <br className="hidden sm:inline" />
      <span className="text-indigo-500"> Take advantage of it.</span>
    </h1>
    <p className="mt-4 text-gray-600 text-xl">
      Workcation helps you find work-friendly rentals in beautiful locations so you can enjoy some nice weather even when you’re not on vacation.
    </p>
    <div className="mt-6">
      <Button onClick={()=>onLogin()}>Book your escape</Button>
    </div>
  </div>
}