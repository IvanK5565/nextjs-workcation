import { IService } from ".";
import BaseContext from "../BaseContext";

export default class SubjectsService extends BaseContext implements IService {
  
  public async save(body:Record<string, string>) {
    const subjects = this.di.SubjectsModel;
    const {id,...fields} = body;
    let model = subjects.build();
    if(id){
      let finded = await subjects.findByPk(Number(id));
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
    return this.di.SubjectsModel.findByPk(id);
  }
  public findByFilter(limit: number, page: number, filters?: Record<string, string>) {
    return this.di.SubjectsModel.findAll({where:filters, limit:limit, offset:limit*(page-1)});
  }
  public delete(id: number) {
    return this.di.SubjectsModel.destroy({
      where: {
        subject_id: id,
      }
    })
  }
}