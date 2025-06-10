import { GRANT } from "@/acl/types";
import { useAcl } from "@/client/hooks"
import container from "@/server/container/container";

export const getServerSideProps = container.resolve('getServerSideProps')([]);

export default function Page(){
  const {allow} = useAcl();
  allow(GRANT.READ)
  return <div>

  </div>
}