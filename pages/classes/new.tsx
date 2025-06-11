import { GRANT } from "@/acl/types";
import { useAcl } from "@/client/hooks"
import container from "@/server/container/container";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const getServerSideProps = container.resolve('getServerSideProps')([]);

export default function Page(){
  const acl = useAcl();
  const router = useRouter();
  useEffect(() => {
    toast('page update');
    if(!acl.allow(GRANT.READ)) router.replace('/403');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return <div className="w-full h-full flex justify-center items-center">
    Create class!
  </div>
}