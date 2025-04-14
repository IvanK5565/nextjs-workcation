import type { NextApiRequest, NextApiResponse } from "next";
import BaseContext from "../BaseContext";
import { Op } from "sequelize";
import IContextContainer from "../IContextContainer";
import BaseController from "./BaseController";
import { DEFAULT_LIMIT, DEFAULT_PAGE, FilterType } from "../constants";
import { IService } from "../services";
import { DELETE, GET, POST, RouteMetaData, USE } from "@/server/API/decorators";

@USE((req,res,next)=>next())
export default class UsersController extends BaseController {
  
  protected getService(): IService {
    return this.di.UsersService
  }

  @GET('api/register')
  public actionRegister(req: NextApiRequest, res: NextApiResponse){
    console.log("ACTION REGISTER");
    res.send("ACTION REGISTER");
  }

  public actionLogin(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.query;
    this.di.UsersService.getOneByFilter(req.query as FilterType)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(e => {
      console.error('Error in UsersController: ', e)
    })
  }

  @POST('api/users')
  @POST('api/users/[id]')
  public save(req: NextApiRequest, res: NextApiResponse) {
    this.service.save(req.body)
      .catch(e => {
        console.error("save classes ", e);
        res.status(500).send(e);
      })
      .then(x => res.status(200).send(x));
  }

  @GET('api/users/[id]')
  public findById(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      res.status(500).send("Invalid id");
      return;
    }
    this.service.findById(numId)
      .catch(e => {
        console.error("Error in getting by id: ", e);
        res.status(500).send(e);
      })
      .then(results => {
        res.status(200).send(results);
      });
  }

  @GET('api/users')
  public findByFilter(req: NextApiRequest, res: NextApiResponse) {
    const { limit, page, ...filters } = req.query as FilterType;
    let parsedLimit = Number(limit);
    let parsedPage = Number(page);
    if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
    if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

    this.service.findByFilter(parsedLimit, Math.max(1, parsedPage), filters)
      .then(results => {
        res.status(200).send(results);
      })
      .catch(e => {
        console.error("Error in ClassesService.get: ", e);
        res.status(500).send(e);
      });
  }

  @DELETE('api/users')
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