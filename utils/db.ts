import { Sequelize } from "sequelize-typescript";
import { AwilixContainer } from "awilix";

function getSequelizeConnect(_ctx:AwilixContainer<any>): Sequelize {
  return new Sequelize({
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    host: process.env.DB_HOST!,
    dialect: "mysql",
    port: Number(process.env.DB_PORT),
  })
}

export default getSequelizeConnect;