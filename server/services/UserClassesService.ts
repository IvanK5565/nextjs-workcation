import { IService } from ".";
import BaseContext from "../BaseContext";
import { StringRecord } from "../utils/constants";

export default class UserClassesService extends BaseContext implements IService {
  public async save(body:StringRecord<string>) {
    const Model = this.di.UserClassesModel;
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
    return this.di.ClassesModel.findAll({
      where: {
        class_id: id,
      },
      include: {
        model: this.di.UsersModel,
        as: 'studentsInClass',
        // through: { attributes: [] },//hide junction table userClasses
      },
    });
  }
  public findByFilter(limit: number, page: number, filters?: StringRecord<string>) {
    return this.di.UserClassesModel.findAll(filters);
  }
  public delete(id: number) {
    return this.di.UserClassesModel.destroy({
      where: { user_class_id: id }
    });
  }
}