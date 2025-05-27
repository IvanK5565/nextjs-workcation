import { Sequelize } from "sequelize";
import IContextContainer from "@/server/container/IContextContainer";

function getSequelizeConnect(ctx: IContextContainer): Sequelize {
  const db = new Sequelize(ctx.config);
  return db;
}

export default getSequelizeConnect;