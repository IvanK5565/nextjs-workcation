import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextHandler } from "next-connect";
import container from "@/server/container";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "@/server/exceptions";
import { AnswerType } from "@/types";

export async function authMiddleware(req:NextApiRequest, res:NextApiResponse, next:NextHandler){
  const session = await getServerSession(req,res,container.resolve('authOptions'));
  console.log("authMiddleware: ",session?.user);
  
  if(!session){
    throw new ApiError("Unauthorized", StatusCodes.UNAUTHORIZED, AnswerType.Log);
  }
  return next();
}