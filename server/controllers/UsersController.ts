import type { NextApiRequest } from "next";
import BaseController from "./BaseController";
import { DEFAULT_LIMIT, DEFAULT_PAGE, StringRecord, UserRole } from "../utils/constants";
import { IService } from "../services";
import { DELETE, GET, POST, USE/*, SSR*/ } from "@/server/controllers/decorators";
import type { SSRRequest } from "../SSR/getServerSideProps";
import { getHousesData } from "@/pages/api/data";

// @USE((req, res, next) => next())
export default class UsersController extends BaseController {

  protected getService(): IService {
    return this.di.UsersService
  }

  // @SSR('/')
  @GET('/')
  public async getData(_req: SSRRequest) {
    const data = getHousesData();
    console.log("USERS SSR getData ", data)
    return {data}
  }

  // @SSR('/classes/[id]')
  @GET('/classes/[id]')
  public getTeachersSSR(req: NextApiRequest){
    return this.di.UsersService.findByFilter(100, 1, { role: UserRole.TEACHER })
    .then(teachers => ({teachers}))
  }

  @GET('/api/register')
  public actionRegister(req: NextApiRequest) {
    console.log("ACTION REGISTER");
    return "ACTION REGISTER";
  }

  @GET('/api/login')
  public actionLogin(req: NextApiRequest) {
    const { email, password } = req.query;
    return this.di.UsersService.signIn(email as string, password as string);
  }

  @POST('/api/users')
  @POST('/api/users/[id]')
  public save(req: NextApiRequest) {
    return this.di.UsersService.save(req.body);
  }

  @GET('/api/users/[id]')
  public findById(req: NextApiRequest) {
    const { id } = req.query;
    const numId = Number(id);
    return this.di.UsersService.findById(numId);
  }

  @GET('/api/users')
  public findByFilter(req: NextApiRequest) {
    const { limit, page, ...filters } = req.query as StringRecord<string>;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    return this.di.UsersService.findByFilter(parsedLimit, Math.max(1, parsedPage), filters);
  }

  @DELETE('/api/users')
  public deleteById(req: NextApiRequest) {
    const id = Number(req.query.id);
    return this.di.UsersService.delete(id);
  }
}