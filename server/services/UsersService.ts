import i18 from "@/public/locales/en-US";
import { IService } from ".";
import BaseContext from "../container/BaseContext";
import { ValidateError } from "../exceptions";
import { DEFAULT_LIMIT, DEFAULT_PAGE, UserRole, UserStatus } from "@/constants";

export default class UsersService extends BaseContext implements IService {
	public signIn(email: string, password: string) {
		return this.di.UserModel.findOne({
			where: {
				email: email,
				password: password,
			},
		});
	}
	private validateUser(body: Record<string, string>) {
		if (
			!body.password ||
			body.password.length < 5 ||
			body.password.length > 20
		) {
			throw new ValidateError();
		}
	}
	public signUp(body: Record<string, string>) {
		this.validateUser(body);
		return this.save(body);
	}
	public async save(body: Record<string, string>) {
		const Model = this.di.UserModel;
		const { id, ...fields } = body;
		let model = Model.build();
		if (id) {
			const finded = await Model.findByPk(Number(id));
			if (!finded) {
				throw new Error(i18.InvalidIdErrorMessage);
			}
			model = finded;
		} else {
			const finded = await Model.findOne({ where: { email: fields.email } });
			if (finded) throw new Error(i18.ExistingAccountErrorMessage);
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
		return this.di.UserModel.findByPk(id);
	}
	public findByFilter(
		limit: number = DEFAULT_LIMIT,
		page: number = DEFAULT_PAGE,
		filters?: Record<string, string>
	) {
		return this.di.UserModel.findAll({
			where: filters,
			limit,
			offset: limit * (page - 1),
		});
	}
	public findByRole(role: UserRole, limit?: number, page?: number,) {
		return this.findByFilter(limit, page, { role })
	}
	public findByStatus(status:UserStatus, limit?: number, page?: number,) {
		return this.findByFilter(limit, page, { status })
	}
	public findOneByFilter(filters?: Record<string, string>) {
		return this.di.UserModel.findOne({
			where: filters,
		});
	}
	public findByEmail(email: string) {
		return this.di.UserModel.findOne({ where: { email } });
	}
	public delete(id: number) {
		return this.di.UserModel.destroy({
			where: {
				id: id,
			},
		});
	}
}
