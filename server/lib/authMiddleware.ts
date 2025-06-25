import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, Session } from "next-auth";
import { NextHandler } from "next-connect";
import container from "@/server/container/container";
import { UnauthorizedError } from "@/server/exceptions";

export async function authMiddleware(req:NextApiRequest&{session?:Session|null}, res:NextApiResponse, next:NextHandler){
  if(!req.session){
    req.session = await getServerSession(req, res, container.resolve('authOptions'));
  }
  console.log("authMiddleware: ",req.session?.identity);
  
  if(!req.session || !req.session.identity){
    throw new UnauthorizedError();
  }
  return next();
}