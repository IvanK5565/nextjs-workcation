import { asClass, createContainer, InjectionMode } from "awilix";
import { entities, IEntityContainer } from "../entities";
// import { sagas } from "./sagas";
import { ReduxStore } from "../store/ReduxStore";

export interface IClientContainer extends IEntityContainer{
  // sagas: ReturnType<typeof sagas>;
  store: ReduxStore;
}

const container = createContainer<IClientContainer>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  ...entities,
  // sagas: asFunction(sagas),
  store: asClass(ReduxStore).singleton(),
})

export default container;
