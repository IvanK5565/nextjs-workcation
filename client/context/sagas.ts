import { fork } from "redux-saga/effects";
import BaseEntity from "../entities/BaseEntity";
import { ActionInfo } from "../entities/decorators";
import { IClientContainer } from "./container";

  export function sagas(di: IClientContainer) {
    const actions: ActionInfo[] =
      Reflect.getMetadata("actions", BaseEntity) ?? [];
    const sagas = actions.map(({ entityName, methodName }) =>
      {
        const saga = di[entityName].createSagaWatcher(methodName)
        return fork(saga)
      }
    );
    return sagas;
  }