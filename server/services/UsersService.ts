import { IService } from ".";
import BaseContext from "../container/BaseContext";
import { ValidateError } from "../exceptions";
import { DEFAULT_LIMIT, DEFAULT_PAGE, UserRole, UserStatus } from "@/constants";
import { Logger } from "../logger";
import { IPagerParams, Sort } from "@/client/pagination/IPagerParams";
import { setOpImmutable } from "../utils/sepSequelizeOp";
import { User } from "../models";
import { PageArray } from "@/types";


export default class UsersService extends BaseContext implements IService {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected buildWhereExpressionForUser(filter?: any) {
		if (filter) {
			Logger.info('Filter detected:', filter)
			filter = setOpImmutable(filter, ['firstName', 'lastName', 'email'], 'substring');
		}

		return filter;
	}
	public async pageUsers(pager: IPagerParams) {
		const { UserModel } = this.di;
		const { page = 1, perPage = 10, filter, sort } = pager;

		const where = this.buildWhereExpressionForUser(filter);
		Logger.info('Sorting:', sort)
		const sortField =
			sort?.dir === Sort.none || !sort?.field
				// ? DEFAULT_SORT_FIELD
				? 'id'
				: sort?.field;
		const sortDirection = sort?.dir === Sort.DESC ? 'DESC' : 'ASC';

		const count = await UserModel.count({ where });
		Logger.log('limit',perPage)
		const users:PageArray<User> = await UserModel.findAll({
			where,
			// 		attributes: {
			// 			include: [
			// 				[
			// 					Sequelize.cast(
			// 						Sequelize.literal((
			// 							SELECT COALESCE(SUM(reviews.coins), 0)
			//                               FROM reviews
			//                               WHERE reviews.user_id = users.id
			// 						)),
			// 					'INTEGER',
			//                       ),
			// 	'coins',
			//                   ],
			//               ],
			// },
			order: [[sortField, sortDirection]],
			limit: perPage,
			offset: (page - 1) * perPage,
			include: [{
				model: this.di.ClassesModel,
				as: 'userClasses'
			}]
		});
		users.pagerCount = count;
		// return {
		// 	items: users,
		// 	count,
		// };
		return users;
	}
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
				throw new Error('InvalidIdErrorMessage');
			}
			model = finded;
		} else {
			const finded = await Model.findOne({ where: { email: fields.email } });
			if (finded) throw new Error('ExistingAccountErrorMessage');
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
	public findByStatus(status: UserStatus, limit?: number, page?: number,) {
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
