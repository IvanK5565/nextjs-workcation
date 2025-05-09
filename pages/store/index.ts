import { Action, createStore } from "redux";
import { EntityAction, State } from "./types";
import { entityReduser } from "./redusers/entityReduser";
export default createStore(RootReduser);

export const initState = {
	users: [],
	classes: [],
};

function RootReduser(
	state: State = {
		users: [],
		classes: [],
	},
	action: Action
): State {
	const _action = action as EntityAction;
  console.log('root action', _action)
	const res = {
    users: entityReduser(state.users, action.type, _action.users),
		classes: entityReduser(state.classes, action.type, _action.classes),
	};
  console.log('root res', res)
  return res;
}
