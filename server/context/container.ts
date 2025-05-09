import { createContainer, InjectionMode, asFunction, asValue, asClass } from 'awilix';
import db from '@/server/db';
import config from '@/config';
import models, { associateModels } from '@/server/models'
import controllers from '@/server/controllers';
import services from '@/server/services';
import IContextContainer from './IContextContainer';
import authOptions from '@/server/lib/authOptions'
import { getAjv } from '@/server/ajv';
import redis from '@/server/redis';
import { roles, rules } from '@/config.acl';
import getServerSidePropsContainer from "@/server/controllers/getServerSideProps";
import { DatabaseAdapter } from '@/server/lib/DatabaseAdapter';
import { Logger } from "@/server/logger";

const container = createContainer<IContextContainer>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  ...models,
  ...controllers,
  ...services,
  config: asValue(config),
  db: asFunction(db).singleton(),
  getServerSideProps: asFunction(getServerSidePropsContainer),
  authOptions: asFunction(authOptions).singleton(),
  ajv: asFunction(getAjv).singleton(),
  redis: asFunction(redis).singleton(),
  rules: asValue(rules),
  roles: asValue(roles),
  adapter: asFunction(DatabaseAdapter).singleton(),
  Logger: asClass(Logger).singleton(),
})

associateModels(container);

export default container;