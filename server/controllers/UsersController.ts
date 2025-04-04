import { NextApiRequest, NextApiResponse } from "next";
import { Controller, ControllerInterface } from "./Controller";


export default class UsersController extends Controller implements ControllerInterface {
  public async Put(req: NextApiRequest, res: NextApiResponse) {
    const Classes = this.ctx.Classes;
    const { title, status, teacher_id } = req.body;
    const fields: { [key: string]: any } = {};

    if (title) { fields.title = title; }
    if (status) { fields.status = status; }
    if (teacher_id) { fields.teacher_id = teacher_id; }

    const updatedClass = await Classes.update(fields, 
    {
      where: {
        class_id: req.query.id,
      }
    })

    return updatedClass;
  }

  public async Post(req: NextApiRequest, res: NextApiResponse) {
    const { teacher_id, title, year, status } = req.body;
    const Classes = this.ctx.Classes;
    const createdClass = await Classes.create({
      teacher_id: teacher_id,
      title: title,
      year: year,
      status: status,
    });

    return { message: "CREATED", createdClass };
  }

  public async GetById(req: NextApiRequest, res: NextApiResponse) {
    const Classes = this.ctx.Classes;
    const _class: any = await Classes.findOne({
      where: {
        class_id: req.query.id,
      }
    });
    return _class;
  }

  public async Get(req: NextApiRequest, res: NextApiResponse) {
    const { title, status, teacher_id, limit, page } = req.query;
    const filters: { [key: string]: any } = {};
    const where: { [key: string]: any } = {};

    if (title) {
      where.title = {
        [Op.like]: `%${title}%`, // Search for names containing the query string
      };
    }
    if (status) { where.status = status; }
    if (teacher_id) { where.teacher_id = teacher_id; }
    if (where) { filters.where = where; }
    const limit_n = Number.parseInt(limit as string);
    const page_n = Math.max(1, Number.parseInt(page as string));

    if (limit_n) { filters.limit = limit_n; }
    if (limit_n && page_n) {
      filters.limit = limit_n;
      filters.offset = limit_n * (page_n - 1);
    }
    const Classes = this.ctx.Classes;
    const results = await Classes.findAll(filters)
    return results;
  }

  public async Delete(req: NextApiRequest, res: NextApiResponse) {
    const Classes = this.ctx.Classes;
    const destroyed = await Classes.destroy({
      where: {
        class_id: req.query.id,
      }
    })
    return { status: `deleted ${destroyed} rows`, deleted: destroyed };
  }