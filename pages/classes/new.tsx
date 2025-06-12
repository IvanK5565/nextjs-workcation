import { GRANT } from "@/acl/types";
import { useAcl } from "@/client/hooks"
import ClassForm from "@/components/ui/classForm";
import container from "@/server/container/container";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const getServerSideProps = container.resolve('getServerSideProps')([]);

export default function Page(){
  const acl = useAcl();
  const router = useRouter();

  useEffect(()=>{toast('page update')}, [])
  
  return <div className="w-full h-full flex flex-col justify-center items-center">
    <ClassForm />
  </div>
}