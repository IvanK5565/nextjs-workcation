import { IModelContainer } from "./models";
import { IServicesContainer } from "./services";
import { IControllerContainer } from "./controllers";
import { Sequelize } from "sequelize";
import { AwilixContainer } from "awilix";
import { GSSPFactory } from "@/types";
import { NextAuthOptions } from "next-auth";
import type Ajv from "ajv";
import { RedisClientType } from "redis";

export default interface IContextContainer extends AwilixContainer, IModelContainer, IServicesContainer, IControllerContainer{
  config: any;
  db: Sequelize;
  getServerSideProps: GSSPFactory;
  authOptions:NextAuthOptions,
  ajv:Ajv,
  redis:RedisClientType,
}