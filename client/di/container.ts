import { asClass, asFunction, createContainer, InjectionMode } from "awilix";
import { entities, IEntityContainer } from "../entities";
// import { sagas } from "./sagas";
import { ReduxStore } from "../store/ReduxStore";
import { tContainer } from "../i18n";

export interface IClientContainer extends IEntityContainer{
  // sagas: ReturnType<typeof sagas>;
  store: ReduxStore;
  t: ReturnType<typeof tContainer>;
}

const container = createContainer<IClientContainer>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

container.register({
  ...entities,
  // sagas: asFunction(sagas),
  store: asClass(ReduxStore).singleton(),
  t: asFunction(tContainer).singleton(),
})
export default container;
