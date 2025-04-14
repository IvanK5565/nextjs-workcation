import { createContainer, InjectionMode, asFunction, asValue } from 'awilix';
import db from './db';
import config from '@/config';
import models, { Associations } from './models'
import controllers from './controllers';
import services from './services';
import IContextContainer from './IContextContainer';

const container = createContainer<IContextContainer>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  db: asFunction(db).singleton(),
  config: asValue(config),
  ...models,
  ...controllers,
  ...services,
})

Associations(container as IContextContainer);

export default container;