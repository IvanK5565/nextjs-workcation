import { Model, DataTypes } from "sequelize";
import IContextContainer from "../IContextContainer";
import { UserStatus, UserRole } from "../utils/constants";

export interface IUser {
	id?: number;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	status: UserStatus;
	role: UserRole;
}

export class Users extends Model {
	declare id: number;
	declare first_name: string;
	declare last_name: string;
	declare email: string;
	declare emailVerified: Date;
	declare password: string;
	declare status: UserStatus;
	declare role: UserRole;
	declare createdAt: Date;
	declare updatedAt: Date;
}

export type UsersType = typeof Users;

export default (ctx: IContextContainer) => {
	Users.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isEmail: true, // Validates email format
				},
			},
			emailVerified: {
				type: DataTypes.DATE,
				allowNull: true,
				validate: {
					isDate: true, // Validates email format
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: {
						args: [5, 100],
						msg: "Password must be at least 5 characters.",
					},
				},
			},
			status: {
				type: DataTypes.ENUM,
				values: Object.values(UserStatus),
				allowNull: false,
				validate: {
					isIn: {
						args: [Object.values(UserStatus)],
						msg: `No status. Valid statuses: ${Object.values(UserStatus)}`,
					},
				},
			},
			role: {
				type: DataTypes.ENUM,
				values: Object.values(UserRole),
				allowNull: false,
				validate: {
					isIn: {
						args: [Object.values(UserRole)],
						msg: `No role. Valid roles: ${Object.values(UserRole)}`,
					},
				},
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
				field: "createdAt",
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
				field: "updatedAt",
			},
		},
		{
			sequelize: ctx.db,
			modelName: "Users",
			tableName: "users",
			timestamps: true,
			underscored: true,
		}
	);
	return Users;
};
