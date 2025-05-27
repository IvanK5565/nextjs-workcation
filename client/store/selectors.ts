import { AppState } from ".";

const entitySelector = <K extends keyof AppState['entities']>(name:K) => (state:AppState):AppState['entities'][K] => state.entities[name];

const usersSelector = (state:AppState)=>state.entities.users;
const classesSelector = (state:AppState)=>state.entities.classes;
const subjectsSelector = (state:AppState)=>state.entities.subjects;

export {
  entitySelector,
  usersSelector,
  classesSelector,
  subjectsSelector,
}