import { IService } from ".";
import BaseContext from "../BaseContext";

export default class UsersService extends BaseContext implements IService {
	signIn(email: string, password: string) {
		return this.di.UsersModel.findOne({
			where: {
				email: email,
				password: password,
			},
		});
	}
	public async save(body: Record<string, string>) {
		const Model = this.di.UsersModel;
		const { id, ...fields } = body;
		let model = Model.build();
		if (id) {
			let finded = await Model.findByPk(Number(id));
			if (!finded) {
				throw new Error("Invalid id");
			}
			model = finded;
		} else {
			let finded = await Model.findOne({ where: { email: fields.email } });
			if (finded) throw new Error("Account is already exist!");
		}

		model.set(fields);
		try {
			model.validate();
			return await model.save();
		} catch (e) {
			throw new Error(`Error saving model: ${(e as Error).message}`);
		}
	}
	public findById(id: number) {
		return this.di.UsersModel.findByPk(id);
	}
	public findByFilter(
		limit: number,
		page: number,
		filters?: Record<string, string>
	) {
		return this.di.UsersModel.findAll({
			where: filters,
			limit,
			offset: limit * (page - 1),
		});
	}
	public getOneByFilter(filters?: Record<string, string>) {
		return this.di.UsersModel.findOne({
			where: filters,
		});
	}
	public delete(id: number) {
		return this.di.UsersModel.destroy({
			where: {
				user_id: id,
			},
		});
	}
}
