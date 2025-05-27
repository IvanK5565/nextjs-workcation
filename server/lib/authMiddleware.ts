import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextHandler } from "next-connect";
import container from "@/server/container/container";
import { UnauthorizedError } from "@/server/exceptions";

export async function authMiddleware(req:NextApiRequest, res:NextApiResponse, next:NextHandler){
  const session = await getServerSession(req,res,container.resolve('authOptions'));
  console.log("authMiddleware: ",session?.user);
  
  if(!session){
    throw new UnauthorizedError();
  }
  return next();
}