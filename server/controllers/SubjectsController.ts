import type { NextApiRequest, NextApiResponse } from "next";
import BaseContext from "../BaseContext";
import { Op } from "sequelize";
import BaseController from "./BaseController";
import IContextContainer from "../IContextContainer";
import { DELETE, GET, POST, USE } from "./decorators";
import { StringMap, DEFAULT_LIMIT, DEFAULT_PAGE } from "../utils/constants";
import { IService } from "../services";

@USE((req,res,next)=>next())
export default class SubjectsController extends BaseController {

  protected getService(): IService { return this.di.SubjectsService }
  
  @POST('api/subjects')
  @POST('api/subjects/[id]')
  public save(req: NextApiRequest) {
    return this.di.SubjectsService.save(req.body);
  }

  @GET('api/subjects/[id]')
  public findById(req: NextApiRequest) {
    const { id } = req.query;
    const numId = Number(id);
    return this.di.SubjectsService.findById(numId);
  }

  @GET('api/subjects')
  public findByFilter(req: NextApiRequest) {
    const { limit, page, ...filters } = req.query as StringMap;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    return this.di.SubjectsService.findByFilter(parsedLimit, Math.max(1, parsedPage), filters);
  }

  @DELETE('api/subjects')
  public deleteById(req: NextApiRequest) {
    const id = Number(req.query.id);

    return this.di.SubjectsService.delete(id);
  }
}