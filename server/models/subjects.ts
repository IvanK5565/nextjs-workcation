import { Model, DataTypes } from 'sequelize';
import IContextContainer from '../IContextContainer';

export class Subjects extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export type SubjectsType = typeof Subjects;

export default (ctx: IContextContainer) => {
  Subjects.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'Subjects',
      tableName: 'subjects',
      timestamps: true,
      underscored: true,
    }
  );
  return Subjects;
}