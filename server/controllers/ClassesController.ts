import type { NextApiRequest, NextApiResponse } from "next";
import BaseContext from "../BaseContext";
import { DEFAULT_LIMIT, DEFAULT_PAGE, StringMap, UserRole } from "../utils/constants";
import BaseController, { Middleware } from "./BaseController";
import type IContextContainer from "../IContextContainer";
import { IService } from "../services";
import { DELETE, GET, POST, SSR, USE } from "./decorators";


@USE(async (_req, _res, next) => {
  return await next();
})
export default class ClassesController extends BaseController {

  protected getService(): IService {
    return this.di.ClassesService
  }

  @POST('api/classes')
  @POST('api/classes/[id]')
  public save(req: NextApiRequest) {
    return this.di.ClassesService.save(req.body);
  }


  @SSR('classes/[id]')
  public getEditClassDataSSR(req: NextApiRequest) {
    const { id } = req.query;
    return this.di.ClassesService.findById(Number(id)).then(res => ({_class: res}))
  }


  @USE((_req, _res, next) => {
    next();
  }, 'api/classes/[id]')
  @GET('api/classes/[id]')
  public findById({ query }: NextApiRequest) {
    const { id } = query;
    const numId = Number(id);
    return this.di.ClassesService.findById(numId);
  }

  @GET('api/classes')
  public findByFilter(req: NextApiRequest) {
    const { limit, page, ...filters } = req.query as StringMap;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    return this.di.ClassesService.findByFilter(parsedLimit, Math.max(1, parsedPage), filters);
  }

  @DELETE('api/classes/[i]')
  public deleteById(req: NextApiRequest) {
    const id = Number(req.query.id);

    return this.di.ClassesService.delete(id);
  }
}


