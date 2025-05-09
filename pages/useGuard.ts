import Guard from "@/acl/Guard";
import { roles, rules } from "@/config.acl";
import { useSession } from "next-auth/react"

export default function useGuard(resource:string){
  const session = useSession();
  if(session.status === 'authenticated'){
    return new Guard(roles, rules, session.data.user, resource);
  }
  return null;
}