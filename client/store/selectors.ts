import { AppState } from "@/client/store/ReduxStore";
import { Entities } from "./types";

function entitySelector<T extends keyof Entities>(name:T) {
  return (state:AppState) => state.entities[name] as Entities[T];
}


export {
  entitySelector,
}