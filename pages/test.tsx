import Client from "@/components/Client";
import { SessionProvider, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  }
  return <SessionProvider session={session}>
    <Client />
  </SessionProvider>
}

