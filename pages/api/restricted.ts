import container from "@/server/container"
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"

export default async (req:NextApiRequest, res:NextApiResponse) => {
  const authOptions = container.resolve('authOptions');
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}