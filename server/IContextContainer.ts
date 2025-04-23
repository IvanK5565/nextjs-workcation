import { IModelContainer } from "./models";
import { IServicesContainer } from "./services";
import { IControllerContainer } from "./controllers";
import { Sequelize } from "sequelize";
import { AwilixContainer } from "awilix";
import { GSSPFactory } from "./SSR/getServerSideProps";
import { NextAuthOptions } from "next-auth";

export default interface IContextContainer extends AwilixContainer, IModelContainer, IServicesContainer, IControllerContainer{
  config: any;
  db: Sequelize;
  getServerSideProps: GSSPFactory;
  associateModels:void;
  authOptions:NextAuthOptions
}