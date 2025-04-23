import type { NextApiRequest } from "next";
import { DEFAULT_LIMIT, DEFAULT_PAGE, StringRecord } from "../utils/constants";
import BaseController from "./BaseController";
import { IService } from "../services";
import { DELETE, GET, POST, USE/*,SSR*/ } from "./decorators";

@USE(async (_req, _res, next) => {
  return await next();
})
export default class ClassesController extends BaseController {

  protected getService(): IService {
    return this.di.ClassesService
  }

  // @SSR('/classes/[id]')
  // @USE((_req, _res, next) => {
  //   return next();
  // })
  @GET('/classes/[id]')
  public getEditClassDataSSR(req: NextApiRequest) {
    const { id } = req.query;
    return this.di.ClassesService.findById(Number(id)).then(res => ({ _class: res }))
  }

  @USE((_req, _res, next) => {
    console.log('--------------------- save');
    return next();
  })
  @POST('/api/classes')
  @POST('/api/classes/[id]')
  public save(req: NextApiRequest) {
    return this.di.ClassesService.save(req.body);
  }

  // @USE((_req, _res, next) => {
  //   console.log('--------------------- findById 1');
  //   return next();
  // })
  // @USE((_req, _res, next) => {
  //   console.log('--------------------- findById 2');
  //   return next();
  // })
  @GET('/api/classes/[id]')
  public findById({ query }: NextApiRequest) {
    const id = Number(query.id);
    return this.di.ClassesService.findById(id);
  }


  @GET('/api/classes')
  public findByFilter(req: NextApiRequest) {
    const { limit, page, ...filters } = req.query as StringRecord<string>;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    return this.di.ClassesService.findByFilter(parsedLimit, Math.max(1, parsedPage), filters);
  }

  @DELETE('/api/classes/[i]')
  public deleteById(req: NextApiRequest) {
    const id = Number(req.query.id);

    return this.di.ClassesService.delete(id);
  }
}


