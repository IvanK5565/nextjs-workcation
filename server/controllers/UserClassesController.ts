import type { NextApiRequest } from "next";
import BaseController from "./BaseController";
import { DELETE, POST, GET } from "./decorators";
import { StringRecord, DEFAULT_LIMIT, DEFAULT_PAGE } from "../utils/constants";

export default class UserClassesController extends BaseController {

  protected getService() { return this.di.UserClassesService }

  @POST('/api/usersInClass')
  @POST('/api/usersInClass/[id]')
  public save(req: NextApiRequest) {
    return this.di.UserClassesService.save(req.body);
  }

  @GET('/api/usersInClass/[id]')
  public findById(req: NextApiRequest) {
    const { id } = req.query;
    const numId = Number(id);
    return this.di.UserClassesService.findById(numId);
  }

  @GET('/api/usersInClass')
  public findByFilter(req: NextApiRequest) {
    const { limit, page, ...filters } = req.query as StringRecord<string>;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    return this.di.UserClassesService.findByFilter(parsedLimit, Math.max(1, parsedPage), filters);
  }

  @DELETE('/api/usersInClass')
  public deleteById(req: NextApiRequest) {
    const id = Number(req.query.id);
    return this.di.UserClassesService.delete(id);
  }
}