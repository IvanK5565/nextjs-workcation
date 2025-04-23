import { Op } from "sequelize";
import BaseContext from "../BaseContext";
import { StringRecord } from "../utils/constants";
import { IService } from ".";

export default class ClassesService extends BaseContext implements IService {
	public async save(body: StringRecord<string>) {
		console.log("save: ");
		console.log(body.class_id);
		const { id: class_id, ...fields } = body;
		let model = this.di.ClassesModel.build();
		if (class_id) {
			let finded = await this.di.ClassesModel.findByPk(Number(class_id));
			if (!finded) {
				throw new Error("Invalid id");
			}
			model = finded;
		}

		/**********************/
		model.set(fields);
		return await model
			.validate()
			.catch((e) => Error(`Non-valid model: ${e}`))
			.then(() => model.save())
			.catch((e) => Error(`Error saving model: ${e}`));
	}

	public findById(id: number) {
		return this.di.ClassesModel.findByPk(id);
	}

	public findByFilter(
		limit: number,
		page: number,
		filters?: StringRecord<string>,
	) {
		if (filters && filters.title) {
			const title = { [Op.like]: `%${filters.title}%` };
			return this.di.ClassesModel.findAll({
				where: { ...filters, title },
				limit: limit,
				offset: limit * (page - 1),
			});
		}
		return this.di.ClassesModel.findAll({
			limit: limit,
			offset: limit * (page - 1),
		});
	}

	public delete(id: number) {
		return this.di.ClassesModel.destroy({
			where: { class_id: id },
		});
	}
}
