import type { NextApiRequest, NextApiResponse } from "next";
import BaseContext from "../BaseContext";
import { DEFAULT_LIMIT, DEFAULT_PAGE, FilterType, UserRole } from "../constants";
import BaseController, { Middleware } from "./BaseController";
import type IContextContainer from "../IContextContainer";
import { IService } from "../services";
import { DELETE, GET, POST, SSR, USE } from "../API/decorators";


@USE(async (req, res, next) => {
  return await next();
})
export default class ClassesController extends BaseController {

  protected getService(): IService {
    return this.di.ClassesService
  }

  @POST('api/classes')
  @POST('api/classes/[id]')
  public save(req: NextApiRequest, res: NextApiResponse) {
    this.service.save(req.body)
      .catch(e => {
        console.error("save classes ", e);
        res.status(500).send(e);
      })
      .then(x => res.status(200).send(x));
  }

  
  @SSR('classes/[id]')
  public getEditClassDataSSR(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const filters = { role: UserRole.TEACHER }
    return Promise.all([
      this.di.ClassesService.findById(Number(id)),
      this.di.UsersService.findByFilter(100, 1, filters)
    ]).then(results => {
      let _class = results[0];
      let teachers = results[1];
      return {
        props: {
          _class: JSON.parse(JSON.stringify(_class)),
          teachers: JSON.parse(JSON.stringify(teachers))
        }
      };
    }).catch(error => {
      console.error(error);
      
      return { props: { error: JSON.parse(JSON.stringify(error)) } };
    })
  }
  
  
  @USE((_req, _res, next) => {
    next();
  },'api/classes/[id]')
  @GET('api/classes/[id]')
  public findById(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      res.status(500).send("Invalid id");
      return;
    }
    this.di.ClassesService.findById(numId)
      .catch(e => {
        console.error("Error in getting by id: ", e);
        res.status(500).send(e);
      })
      .then(results => {
        res.status(200).send(results);
      });
  }

  @GET('api/classes')
  public findByFilter(req: NextApiRequest, res: NextApiResponse) {
    const { limit, page, ...filters } = req.query as FilterType;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    this.di.ClassesService.findByFilter(parsedLimit, Math.max(1, parsedPage), filters)
      .then(results => {
        res.status(200).send(results);
      })
      .catch(e => {
        console.error("Error in ClassesService.get: ", e);
        res.status(500).send(e);
      });
  }

  @DELETE('api/classes/[i]')
  public deleteById(req: NextApiRequest, res: NextApiResponse) {
    const id = Number(req.query.id);
    if (isNaN(id)) {
      res.status(500).send('Invalid id');
    }

    this.service.delete(id)
      .then(results => {
        res.status(200).send(results);
      })
      .catch(e => {
        console.error("Error in ClassesController.delete: ", e);
        res.status(500).send(e);
      });
  }
}


