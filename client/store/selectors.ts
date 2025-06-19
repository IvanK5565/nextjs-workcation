import { AppState } from "@/client/store/ReduxStore";
import { Entities } from "./types";

function entitySelector(name:keyof Entities) {
  return (state:AppState) => state.entities[name] as Entities[typeof name];
}


export {
  entitySelector,
}