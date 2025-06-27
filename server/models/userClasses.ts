import { Model, DataTypes } from 'sequelize';
import IContextContainer from '@/server/container/IContextContainer';

export class UserClasses extends Model {
  declare id: number;
  declare class_id: number;
  declare student_id: number;
}

export type UserClassesType = typeof UserClasses;

const UserClassesContainer = (ctx: IContextContainer) => {

  UserClasses.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Classes',
          key: 'id', // Assuming Classes has a 'id' column as the primary key
        },
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: ctx.UserModel,
          key: 'id', // Assuming Users has an 'id' column as the primary key
        },
      },
    },
    {
      sequelize: ctx.db,
      modelName: 'UserClasses',
      tableName: 'userClasses',
      timestamps: false,
      underscored: true,
    }
  );
  return UserClasses;
}

export default UserClassesContainer;