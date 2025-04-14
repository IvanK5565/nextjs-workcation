import { IService } from ".";
import BaseContext from "../BaseContext";
import { FilterType } from "../constants";

export default class UsersService extends BaseContext implements IService  {
  public async save(body:FilterType) {
    const Model = this.di.UsersModel;
    const {id,...fields} = body;
    let model = Model.build();
    if(id){
      let finded = await Model.findByPk(Number(id));
      if(!finded){
        return Promise.reject(Error('Invalid id'))
      }
      model = finded;
    }

    model.set(fields);
   return model.validate()
    .catch(e => Error(`Non-valid model: ${e}`))
    .then(() => model.save())
    .catch(e => Error(`Error saving model: ${e}`))
  }
  public findById(id: number) {
    return this.di.UsersModel.findByPk(id);
  }
  public findByFilter(limit: number, page: number, filters?: FilterType) {
    return this.di.UsersModel.findAll({
      where: filters,
      limit,
      offset: limit*(page-1),
    });
  }
  public getOneByFilter(filters?: FilterType) {
    return this.di.UsersModel.findOne({
      where: filters,
    });
  }
  public delete(id: number) {
    return this.di.UsersModel.destroy({
        where: {
          user_id: id,
        }
      })
  }
}