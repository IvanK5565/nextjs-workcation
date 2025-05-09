import { User, Classes } from "@/server/models";
import { Action } from "redux";

export type State = {
	users: User[];
	classes: Classes[];
};
type EntityContainer = {
	users?: User | User[];
  classes?: Classes | Classes[]
}
export type EntityAction = Action & EntityContainer & {
	type: EntityActionType;
}

export enum EntityActionType {
	ADD = 'add',
	REMOVE = 'remove',
}
