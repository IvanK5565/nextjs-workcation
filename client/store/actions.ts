import { Action } from "redux";
import { Entities } from "./types";
import { IPaginationInfo } from "../pagination/types";
import { AuthState } from "../auth/authReducer";
import {
	ADD_ENTITIES,
	AUTH_SIGN_OUT,
	DELETE_ENTITIES,
	PAGE_CLEAR,
	PAGE_CLEAR_ALL,
	PAGE_CLEAR_BY_ENTITY,
	PAGE_FETCHING,
	PAGE_SELECT_ITEM,
	PAGE_SET_FILTER,
	PAGE_SET_PARAMS,
	SET_AUTH
} from "./actionTypes";
import { IFilterParams, ISortParams } from "../pagination/IPagerParams";


export function action(type: string, payload = {}): Action {
	return { type, ...payload };
}

export const pageFetching = (pageName: string, page: number, isFetching: boolean) => action(PAGE_FETCHING, { pageName, page, isFetching });
export const pageSetParams = (pageName: string, params: Partial<IPaginationInfo>) => action(PAGE_SET_PARAMS, { pageName, params });
export const pageSelectItem = (pageName: string, selected: (number|string)[]) => action(PAGE_SELECT_ITEM, { pageName, selected });
export const pageSetFilter = (pageName: string, filter?: IFilterParams, sort?: ISortParams) => action(PAGE_SET_FILTER, { pageName, filter, sort });
export const pageClear = (pageName: string) => action(PAGE_CLEAR, { pageName })
export const pageClearAll = () => action(PAGE_CLEAR_ALL);
export const pageClearByEntity = (entityName: keyof Entities) => action(PAGE_CLEAR_BY_ENTITY, { entityName });

export const addEntities = (e: Partial<Entities>) => action(ADD_ENTITIES, { payload: e });
export const deleteEntities = (e: Partial<Entities>) => action(DELETE_ENTITIES, { payload: e });

export const setAuth = (auth: AuthState|null) => action(SET_AUTH, { auth });
export const authSignOut = () => action(AUTH_SIGN_OUT);