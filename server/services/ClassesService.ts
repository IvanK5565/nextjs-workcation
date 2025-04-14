import { Op } from "sequelize";
import BaseContext from "../BaseContext";
import { FilterType } from "../constants";
import { IService } from ".";

export default class ClassesService extends BaseContext implements IService {

  public async save(body: FilterType) {
    const { id, ...fields } = body;
    let model = this.di.ClassesModel.build();
    if (id) {
      let finded = await this.di.ClassesModel.findByPk(Number(id));
      if (!finded) {
        return Promise.reject(Error("Invalid id"));
      }
      model = finded;
    } 
    
    //------------------------
   model.set(fields);
   return model.validate()
    .catch(e => Error(`Non-valid model: ${e}`))
    .then(() => model.save())
    .catch(e => Error(`Error saving model: ${e}`))

  }

  public findById(id: number) {
    return this.di.ClassesModel.findByPk(id)
  }

  public findByFilter(limit: number, page: number, filters?: FilterType) {
    if (filters !== undefined && filters.title) {
      filters.title = {
        [Op.like]: `%${filters.title}%`, // Search for names containing the query string
      } as FilterType;
      return this.di.ClassesModel.findAll({
        where: filters,
        limit: limit,
        offset: limit * (page - 1),
      })
    }
    return this.di.ClassesModel.findAll({
      limit: limit,
      offset: limit * (page - 1),
    })
  }

  public delete(id: number) {
    return this.di.ClassesModel.destroy({
      where: { class_id: id }
    })
  }
}
