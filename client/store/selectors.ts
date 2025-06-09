import { AppState } from "@/client/store/ReduxStore";

const entitySelector = <K extends keyof AppState>(name:K) => (state:AppState):AppState[K] => state[name];

const usersSelector = (state:AppState)=>state.users;
const classesSelector = (state:AppState)=>state.classes;
const subjectsSelector = (state:AppState)=>state.subjects;

export {
  entitySelector,
  usersSelector,
  classesSelector,
  subjectsSelector,
}