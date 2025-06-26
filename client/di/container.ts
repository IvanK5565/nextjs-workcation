import { asClass, asFunction, createContainer, InjectionMode } from "awilix";
import { entities, IEntityContainer } from "../entities";
// import { sagas } from "./sagas";
import { ReduxStore } from "../store/ReduxStore";
import { tContainer } from "../i18n";
import Guard from "@/acl/Guard";

export interface IClientContainer extends IEntityContainer{
  // sagas: ReturnType<typeof sagas>;
  store: ReduxStore;
  t: ReturnType<typeof tContainer>;
  guard:Guard
  persistor: ReduxStore['persistor'];
}

function guardContainer({store}:IClientContainer):Guard{
  const rules = store.state?.auth?.rules;
  const roles = store.state?.auth?.roles;
  const role = store.state?.auth?.identity.role;

  return new Guard(roles,rules,role);
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
  guard: asFunction(guardContainer).singleton(),
  persistor: asFunction((di:IClientContainer)=>di.store.persistor),
})
export default container;
