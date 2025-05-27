import { Model, DataTypes } from 'sequelize';
import IContextContainer from '@/server/container/IContextContainer';

export class Subjects extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
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
    },
    {
      sequelize: ctx.db,
      modelName: 'Subjects',
      tableName: 'subjects',
      timestamps: false,
      underscored: true,
    }
  );
  return Subjects;
}