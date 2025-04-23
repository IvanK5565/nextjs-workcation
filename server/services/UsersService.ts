import { IService } from ".";
import BaseContext from "../BaseContext";
import { StringRecord } from "../utils/constants";

export default class UsersService extends BaseContext implements IService  {
  signIn(email: string, password: string) {
    return this.di.UsersModel.findOne({
      where: {
        email: email,
        password: password
      }
    })
  }
  public async save(body:StringRecord<string>) {
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
  public findByFilter(limit: number, page: number, filters?: StringRecord<string>) {
    return this.di.UsersModel.findAll({
      where: filters,
      limit,
      offset: limit*(page-1),
    });
  }
  public getOneByFilter(filters?: StringRecord<string>) {
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