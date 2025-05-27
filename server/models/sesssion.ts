import { DataTypes, Model } from "sequelize";
import IContextContainer from "@/server/container/IContextContainer";

export class Session extends Model {
  declare id: string;
  declare expires: Date;
  declare sessionToken: string;
  declare userId: string;
}

export type SessionType = typeof Session;

export default (ctx: IContextContainer) => {

  Session.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sessionToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:null,
        references: {
          model: 'Users',
          key: 'id', // assuming Users has an 'id' column as the primary key
        },
      },
    },
    {
      sequelize: ctx.db,
      modelName: 'Session',
      tableName: 'sessions',
      timestamps: true,
      underscored: true,
    }
  );
  return Session;
}