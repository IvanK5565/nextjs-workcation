import { Model, DataTypes } from "sequelize";
import IContextContainer from "@/server/context/IContextContainer";
import { UserStatus, UserRole } from "@/constants";
import bcrypt from 'bcrypt';

export interface IUser {
	id?: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	status: UserStatus;
	role: UserRole;
}

export class User extends Model {
	declare id: number;
	declare firstName: string;
	declare lastName: string;
	declare email: string;
	declare emailVerified: Date;
	declare password: string;
	declare status: UserStatus;
	declare role: UserRole;
	// declare createdAt: Date;
	// declare updatedAt: Date;

	public verifyPassword(plainPassword: string){
		return bcrypt.compare(plainPassword, this.password);
	}
}

export type UserType = typeof User;

export default (ctx: IContextContainer) => {
	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
				field:'id',
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				field:'firstName'
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				field:'lastName'
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
				field: 'emailVerified',
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: {
						args: [4, 100],
						msg: "Password must be at least 4 characters.",
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
			modelName: "User",
			tableName: "users",
			timestamps: true,
			underscored: true,
			hooks:{
				beforeCreate: async (user) => {
					if (user.password) {
						const salt = await bcrypt.genSalt(10);
						user.password = await bcrypt.hash(user.password, salt);
					}
				},
				beforeUpdate: async (user) => {
					if (user.changed('password')) {
						const salt = await bcrypt.genSalt(10);
						user.password = await bcrypt.hash(user.password, salt);
					}
				}
			}
		}
	);
	return User;
};
