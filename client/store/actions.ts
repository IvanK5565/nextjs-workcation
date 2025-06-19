import { Action } from "redux";
import { Entities } from "./types";
import { IPaginationInfo } from "../pagination/types";

export const PAGE_FETCHING = 'PAGE_FETCHING'
export const PAGE_SET_FILTER = 'PAGE_SET_FILTER'
export const PAGE_SELECT_ITEM = 'PAGE_SELECT_ITEM'
export const PAGE_CLEAR = 'PAGE_CLEAR'
export const PAGE_CLEAR_ALL = 'PAGE_CLEAR_ALL'
export const PAGE_SET_PARAMS = 'PAGE_SET_PARAMS'

export const ADD_ENTITIES = 'ADD_ENTITIES'
export const DELETE_ENTITIES = 'DELETE_ENTITIES'

export function action(type: string, payload = {}): Action {
	return { type, ...payload };
}

export function setPagerParams(pageName: string, params: Partial<IPaginationInfo>) {
	return action(PAGE_SET_PARAMS, { pageName, params });
}
// TODO
export function pageSelectItem(pageName: string, selected: any[]) {
	return action(PAGE_SELECT_ITEM, { pageName, selected });
}
// TODO
export function pageSetFilter(pageName: string, filter: any, sort:any) {
	return action(PAGE_SELECT_ITEM, { filter, sort });
}

export const addEntities = (e: Partial<Entities>) => action(ADD_ENTITIES, { payload: e });

export const deleteEntities = (e: Partial<Entities>) => action(DELETE_ENTITIES, {payload: e});