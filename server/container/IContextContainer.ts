import { IModelContainer } from "@/server/models";
import { IServicesContainer } from "@/server/services";
import { IControllerContainer } from "@/server/controllers";
import { Sequelize } from "sequelize";
import { AwilixContainer } from "awilix";
import { NextAuthOptions } from "next-auth";
import type Ajv from "ajv";
import { RedisClientType } from "redis";
import { IRoles, IRules, ROLE } from "@/acl/types";
import { GSSPFactory } from "@/types";
import { Adapter } from "next-auth/adapters";
import { Logger } from "@/server/logger";
import { Cleaner } from "@/acl/cleaner";

export default interface IContextContainer extends AwilixContainer, IModelContainer, IServicesContainer, IControllerContainer{
  config: any;
  db: Sequelize;
  authOptions:NextAuthOptions,
  ajv:Ajv,
  redis:RedisClientType,
  roles:IRoles,
  rules:IRules,
  getServerSideProps: GSSPFactory;
  adapter:Adapter;
  Logger:Logger;
  cleaner:Cleaner;
}