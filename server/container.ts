import { createContainer, InjectionMode, asFunction, asValue } from 'awilix';
import db from './db';
import config from '@/config';
import models, { Associations } from './models'
import controllers from './controllers';
import services from './services';
import IContextContainer from './IContextContainer';
import getServerSidePropsContainer from './SSR/getServerSideProps';
import authOptions from '@/server/API/authOptions'

const container = createContainer<IContextContainer>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  db: asFunction(db).singleton(),
  config: asValue(config),
  getServerSideProps: asFunction(getServerSidePropsContainer),
  ...models,
  ...controllers,
  ...services,
  associateModels: asFunction(Associations).singleton(),
  authOptions: asFunction(authOptions).singleton(),
})

// Associations(container as IContextContainer);
container.resolve('associateModels');

export default container;