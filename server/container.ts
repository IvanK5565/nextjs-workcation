import { createContainer, InjectionMode, asFunction, asValue } from 'awilix';
import db from './db';
import config from '@/config';
import models, { associateModels } from './models'
import controllers from './controllers';
import services from './services';
import IContextContainer from './IContextContainer';
import getServerSidePropsContainer from './controllers/getServerSideProps';
import authOptions from '@/server/lib/authOptions'
import { getAjv } from './ajv';
import redis from './redis';

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
})

associateModels(container);

export default container;