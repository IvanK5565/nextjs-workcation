import Client from "@/components/Client";
import { SessionProvider, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
return <SessionProvider session={session}>
    <Client />
  </SessionProvider>
}

