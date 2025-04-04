import { NextApiRequest, NextApiResponse } from "next";
import { Op } from "sequelize";
import {Controller, ControllerInterface} from "./Controller";

export default class SubjectsController extends Controller implements ControllerInterface {
  constructor(_ctx: any) {
    super(_ctx);
  }

  public async Put(req: NextApiRequest, res: NextApiResponse) {
    const Subjects = this.ctx.Subjects;
    const { first_name, last_name, role, status } = req.body;

    const fields: { [key: string]: any } = {};

    if (first_name) { fields.name = first_name; }
    if (last_name) { fields.last_name = last_name; }
    if (role) { fields.role = role; }
    if (status) { fields.status = status; }

    console.log(fields);
    const updatedSubject = await Subjects.update(fields,
      {
        where: {
          class_id: req.query.id,
        }
      })

    return updatedSubject;
  }

  public async Post(req: NextApiRequest, res: NextApiResponse) {
    const { name, description } = req.body;
    const Subjects = this.ctx.Subjects;
    const createdSubject = await Subjects.create({
      name: name,
      description: description,
    })

    return { message: "CREATED", createdSubject };
  }

  public async GetById(req: NextApiRequest, res: NextApiResponse) {
    const Subjects = this.ctx.Subjects;
    const subjects: any = await Subjects.findOne({
      where: {
        subject_id: req.query.id,
      }
    });
    return subjects;
  }

  public async Get(req: NextApiRequest, res: NextApiResponse) {
    const { class_id, name, description, limit, page } = req.query;
    const limit_n = Number.parseInt(limit as string);
    const page_n = Math.max(1, Number.parseInt(page as string));

    const filters: { [key: string]: any } = {};
    const where: { [key: string]: any } = {};

    if (class_id) { where.class_id = class_id }
    if (name) {
      where.name = {
        [Op.like]: `%${name}%`, // Search for names containing the query string
      };
    }
    if (description) {
      where.description = {
        [Op.like]: `%${description}%`, // Search for names containing the query string
      };
    }
    if (where) { filters.where = where; }
    if (limit_n) { filters.limit = limit_n; }
    if (limit_n && page_n) {
      filters.limit = limit_n;
      filters.offset = limit_n * (page_n - 1);
    }

    const Subjects = this.ctx.Subjects;
    const results = await Subjects.findAll(filters)
    return results;
  }

  public async Delete(req: NextApiRequest, res: NextApiResponse) {
    const Subjects = this.ctx.Subjects;
    const destroyed = await Subjects.destroy({
      where: {
        user_id: req.query.id,
      }
    })
    return { status: `deleted ${destroyed} rows`, deleted: destroyed };
  }
}