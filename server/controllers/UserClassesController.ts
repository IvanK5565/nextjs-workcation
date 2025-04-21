import type { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./BaseController";
import { DELETE, POST, GET } from "./decorators";
import { StringMap, DEFAULT_LIMIT, DEFAULT_PAGE } from "../utils/constants";

export default class UserClassesController extends BaseController {

  protected getService() { return this.di.UserClassesService }

  @POST('api/usersInClass')
  @POST('api/usersInClass/[id]')
  public save(req: NextApiRequest) {
    return this.di.UserClassesService.save(req.body);
  }

  @GET('api/usersInClass/[id]')
  public findById(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      res.status(500).send("Invalid id");
      return;
    }
    return this.di.UserClassesService.findById(numId);
  }

  @GET('api/usersInClass')
  public findByFilter(req: NextApiRequest, res: NextApiResponse) {
    const { limit, page, ...filters } = req.query as StringMap;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    return this.di.UserClassesService.findByFilter(parsedLimit, Math.max(1, parsedPage), filters);
  }

  @DELETE('api/usersInClass')
  public deleteById(req: NextApiRequest, res: NextApiResponse) {
    const id = Number(req.query.id);
    if (isNaN(id)) {
      res.status(500).send('Invalid id');
    }

    return this.di.UserClassesService.delete(id);
  }
}