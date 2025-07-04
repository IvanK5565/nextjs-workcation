import { Op } from "sequelize";
import BaseContext from "../container/BaseContext";
import { IService } from ".";

export default class ClassesService extends BaseContext implements IService {
	public async save(body: Record<string,string>) {
		console.log("save: ");
		const { class_id } = body;
		console.log('save id', class_id);
		let model = this.di.ClassesModel.build();
		if (class_id) {
			const finded = await this.di.ClassesModel.findByPk(Number(class_id));
			if (!finded) {
				throw new Error("Invalid id");
			}
			model = finded;
		}

		/**********************/
		model.set({...body, year:Number(body.year), teacher_id:Number(body.teacher_id)});
		console.log('save model:', model)
		return await model
			.validate()
			.catch((e) => Error(`Non-valid model: ${e}`))
			.then(() => model.save())
			.catch((e) => Error(`Error saving model: ${e}`));
	}

	public findById(id: number) {
		return this.di.ClassesModel.findByPk(id, {
			include: [{
				model:this.di.UserModel,
				as:'teacher',
			},
			{
				model:this.di.UserModel,
				as:'studentsInClass',
				through: {
        attributes: [] // exclude all attributes from the join table
      }
			},]
		});
	}

	public findByFilter(
		limit: number,
		page: number,
		filters?: Record<string, string>,
	) {
		if (filters && filters.title) {
			const title = { [Op.like]: `%${filters.title}%` };
			return this.di.ClassesModel.findAll({
				where: { ...filters, title },
				limit: limit,
				offset: limit * (page - 1),
				include: [{
					model:this.di.UserModel,
					as:'teacher',
				},
				{
					model:this.di.UserModel,
					as:'studentsInClass',
				},]
			});
		}
		return this.di.ClassesModel.findAll({
			limit: limit,
			offset: limit * (page - 1),
			include: [{
				model:this.di.UserModel,
				as:'teacher',
			},
			{
				model:this.di.UserModel,
				as:'studentsInClass',
			},]
		});
	}

	public delete(id: number) {
		return this.di.ClassesModel.destroy({
			where: { class_id: id },
		});
	}

	public async addToClass(userId:number, classId:number){
		const finded = await this.di.UserClassesModel.findOne({
			where:{
				student_id: userId,
				class_id:classId,
			}
		});
		if(finded){
			throw new Error('userActualyInClass');
		}
		return this.di.UserClassesModel.create({
			student_id:userId,
			class_id:classId
		})
	}
	public async removeFromClass(userId:number, classId:number){
		const finded = await this.di.UserClassesModel.findOne({
			where:{
				student_id: userId,
				class_id:classId,
			}
		});
		if(!finded){
			throw new Error('userActualyNotInClass');
		}
		return finded.destroy();
	}
}
