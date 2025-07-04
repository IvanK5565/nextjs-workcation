import { Model, DataTypes } from 'sequelize';
import IContextContainer from '@/server/container/IContextContainer';
import { ClassStatus } from '@/constants';

export class Classes extends Model {
  declare id: number;
  declare teacher_id: number;
  declare title: string;
  declare year: number;
  declare status: ClassStatus;
  // declare createdAt: Date;
  // declare updatedAt: Date;
}

export type ClassesType = typeof Classes;

const ModelContainer = (ctx: IContextContainer) => {

  Classes.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id', // assuming Users has an 'id' column as the primary key
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(ClassStatus)as [string],
        allowNull: false,
        validate: {
          isIn: [Object.values(ClassStatus)as [string]],
        },
      },
      // createdAt: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      //   field: 'createdAt',
      //   defaultValue: DataTypes.NOW,
      // },
      // updatedAt: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      //   field: 'updatedAt',
      //   defaultValue: DataTypes.NOW,
      // },
    },
    {
      sequelize: ctx.db,
      modelName: 'Classes',
      tableName: 'classes',
      timestamps: false,
      underscored: true,
    });
  return Classes;
}
export default ModelContainer;