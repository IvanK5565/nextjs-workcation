import type { NextApiRequest, NextApiResponse } from "next";
import BaseController from "./BaseController";
import { DELETE, POST, GET } from "../API/decorators";
import { FilterType, DEFAULT_LIMIT, DEFAULT_PAGE } from "../constants";

export default class UserClassesController extends BaseController {

  protected getService() { return this.di.UserClassesService }

  @POST('api/usersInClass')
  @POST('api/usersInClass/[id]')
  public save(req: NextApiRequest, res: NextApiResponse) {
    this.service.save(req.body)
      .catch(e => {
        console.error("save classes ", e);
        res.status(500).send(e);
      })
      .then(x => res.status(200).send(x));
  }

  @GET('api/usersInClass/[id]')
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

  @GET('api/usersInClass')
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

  @DELETE('api/usersInClass')
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