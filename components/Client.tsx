import { signIn, signOut, useSession } from "next-auth/react";

export default function Client() {
  const { data: session } = useSession();
  if (session) {
    return <>
      <p className="shadow-sm" >Signed in as {session.user?.email}</p>
      <br />
      <button className="shadow-sm" onClick={() => signOut()}>Sign Out</button>
    </>
  }
  return <>
    <p className="shadow-sm" >Not signed in</p>
    <br />
    <button className="shadow-sm" onClick={() => signIn()}>Sign In</button>
  </>
}