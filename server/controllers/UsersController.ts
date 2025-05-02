import type { NextApiRequest } from "next";
import BaseController from "./BaseController";
import { DEFAULT_LIMIT, DEFAULT_PAGE, UserRole } from "../utils/constants";
import { IService } from "../services";
import { BODY, DELETE, GET, POST, USE/*, SSR*/ } from "@/server/controllers/decorators";
import { getHousesData } from "@/pages/api/data";
import type { ActionProps } from "@/types";
import { hashPassword } from "../utils";

// @USE(authMiddleware)
export default class UsersController extends BaseController {

  protected getService(): IService {
    return this.di.UsersService
  }

  // @SSR('/')
  @GET('/')
  public async getData() {
    const data = getHousesData();
    console.log("USERS SSR getData ", data)
    return {data}
  }

  // @SSR('/classes/[id]')
  @GET('/classes/[id]')
  public getTeachersSSR(){
    return this.di.UsersService.findByFilter(100, 1, { role: UserRole.TEACHER })
    .then(teachers => ({teachers}))
  }

  @BODY({
    type: "object",
    properties: {
      id: {type:'integer', nullable:true},
      first_name: { type: "string" },
      last_name: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string", format: "password"  },
      role: {type:'string'},
      status:{type:'string'},
    },
    required:['first_name', 'last_name', 'email', 'password', 'role', 'status']
  })
  @POST('/api/register')
  public async actionRegister({body}: ActionProps) {
    const hPass = await hashPassword(body.password)
    console.log({...body, password:hPass});
    return this.di.UsersService.save({...body, password:hPass});
  }

  @GET('/api/login')
  public actionLogin(req: NextApiRequest) {
    const { email, password } = req.query;
    return this.di.UsersService.signIn(email as string, password as string);
  }

  @POST('/api/users')
  @POST('/api/users/[id]')
  public save({body}: ActionProps) {
    return this.di.UsersService.save(body);
  }

  @GET('/api/users/[id]')
  public findById({query}: ActionProps) {
    const { id } = query!;
    const numId = Number(id);
    return this.di.UsersService.findById(numId);
  }

  @GET('/api/users')
  public findByFilter({query}: ActionProps) {
    const { limit, page, ...filters } = query as Record<string,string>;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    return this.di.UsersService.findByFilter(parsedLimit, Math.max(1, parsedPage), filters);
  }

  @DELETE('/api/users')
  public deleteById({query}: ActionProps) {
    const id = Number(query!.id);
    return this.di.UsersService.delete(id);
  }
}