import { NextApiRequest, NextApiResponse } from "next";

export interface ControllerInterface{
  Put(req: NextApiRequest, res: NextApiResponse):any;
  Post(req: NextApiRequest, res: NextApiResponse):any;
  Get(req: NextApiRequest, res: NextApiResponse):any;
  GetById(req: NextApiRequest, res: NextApiResponse):any;
  Delete(req: NextApiRequest, res: NextApiResponse):any;
}

export class Controller{
  protected ctx: any;
  constructor(_ctx: any) {
    this.ctx = _ctx;
  }  
}