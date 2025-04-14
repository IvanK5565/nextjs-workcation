import { Model, DataTypes } from 'sequelize';
import IContextContainer from '../IContextContainer';

class UserClasses extends Model {
  declare user_class_id: number;
  declare class_id: number;
  declare student_id: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export type UserClassesType = typeof UserClasses;

export default (ctx: IContextContainer) => {

  UserClasses.init(
    {
      user_class_id: {
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
          key: 'class_id', // Assuming Classes has a 'class_id' column as the primary key
        },
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: ctx.UsersModel,
          key: 'id', // Assuming Users has an 'id' column as the primary key
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'createdAt',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updatedAt',
      },
    },
    {
      sequelize: ctx.db,
      modelName: 'UserClasses',
      tableName: 'userClasses',
      timestamps: true,
      underscored: true,
    }
  );
  return UserClasses;
}
