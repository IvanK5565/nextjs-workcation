/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnswerType, Response } from "@/types";
import { normalize, Schema } from "normalizr";
import {
	actionChannel,
	call,
	Effect,
	put,
	select,
	take,
} from "redux-saga/effects";
import { addEntities } from "../store/actions";
import { IEntityContainer } from ".";
import { BaseContext } from "../di/BaseContext";
import container, { IClientContainer } from "../di/container";
import { toast } from "react-toastify";
import { IPagerParams, TPaginationInfo } from "../paginatorExamples/types";
import { AppState } from "../store/ReduxStore";
import { PAGE_SET_FILTER, PAGE_SET_PARAMS } from "../Pagination/reducer";
import get from "lodash/get";
import has from "lodash/has";

export type EntityAction<E extends BaseEntity> = {
	type: keyof Omit<E, keyof BaseEntity>;
	payload?: any;
};

export type EntitiesName = keyof IEntityContainer;

export default abstract class BaseEntity extends BaseContext {
	protected abstract schema: Schema;
	protected abstract name: EntitiesName;
	public foo = "bar";

	public getName = () => this.name;
	public getSchema = () => this.schema;
	public normalize = (data: object) =>
		normalize(data, Array.isArray(data) ? [this.schema] : this.schema);

	public get actions() {
		const actions: string[] = Reflect.getMetadata('actions', this) ?? []
		return Object.fromEntries(actions.map(action => [action, (data?: any) => ({ type: action, payload: data })]))
	}

	public static sagas(di: IClientContainer) {
		const actions: (keyof IClientContainer)[] =
			Reflect.getMetadata("actions", BaseEntity) ?? [];
		const res: (() => Generator<Effect>)[] = []
		return res.concat(
			...(actions
				// .filter(name => Object.hasOwn(di, name))
				.map(name => di[name])
				.filter(entity => entity instanceof BaseEntity)
				.map(entity => entity.sagas()))
		)
	}
	public sagas() {
		const actions: string[] = Reflect.getMetadata("actions", this) ?? [];
		const sagas = actions
			.filter((action) => action in this)
			.map((action) => {
				const worker = (this as any)[action].bind(this);
				return function* (): Generator<Effect> {
					const chan = yield actionChannel(action);
					while (true) {
						const { payload } = yield take(chan);
						try {
							yield call(worker, payload);
						} catch (e) {
							console.error('Error in saga', (e as Error).message);
							throw e;
						}
					}
				};
			});
		return sagas;
	}

	private static async xFetch<TBody = unknown>(
		url?: string,
		method?: "GET" | "POST",
		body?: TBody
	) {
		if (!url || !method) throw new Error("xFetch: no url");
		const res: Response = await fetch("/api/" + url, {
			method,
			body: body ? JSON.stringify(body) : undefined,
		}).then((data) => data.json());
		if (!res.success) {
			if (res.type && res.type === AnswerType.Toast) {
			}
			throw new Error(res.message);
		} else {
			return res;
		}
	}

	private *actionRequest(
		method: "GET" | "POST",
		url?: string,
		body?: any
	): Generator {
		try {
			const res = yield call(BaseEntity.xFetch, url, method, body);
			if (res) {
				const normalData = this.normalize(res.data);
				yield put(addEntities(normalData.entities));
			}
			const text = this.di.t('requestCompleted')
			toast.success(res.message ?? text ?? 'Request Completed!')
		} catch (e) {
			const text = this.di.t('requestFailed')
			toast.error(text + ': ' + (e as Error).message);
			console.error('in actionRequest', (e as Error).message ?? e);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public xRead(url?: string, method: "GET" | "POST" = "GET", pagerData?: object, force?: boolean) {
		return this.actionRequest(method, url);
	}
	public xSave(url: string, body: any = {}) {
		return this.actionRequest("POST", url, body);
	}
	public xDelete(url?: string, method: "GET" | "POST" = "GET") {
		return this.actionRequest(method, url);
	}

	// Pagination

	public *pageEntity(uri: string, params: IPagerParams): Generator<Effect> {
		const actionTypes = {
			pageSetFilter: (pageName: string, filter: any, sort:any) => {
				return {
					type: PAGE_SET_FILTER,
					pageName,
					filter,
					sort
				}
			},
			setPagerParams: (pageName: string, params: any) => {
				return {
					type: PAGE_SET_PARAMS,
					pageName,
					params
				}
			}
		}
		const pageName = params.pageName ?? '';
		const pagination: TPaginationInfo = yield select(
			(state: AppState & { pagination: TPaginationInfo }) => state.pagination ?? {},
		);
		if (!('page' in params)) {
			params['page'] = pagination[pageName]['currentPage'];
		}
		let count = 0;
		if (
			!params.force &&
			pagination[pageName] &&
			pagination[pageName]['count']
		) {
			count = pagination[pageName]['count'];
		}

		// set filter to paginator, in case fetch from getInitProps()
		const pFilter = params.filter ? params.filter : {};
		const pSort = params.sort ? params.sort : {};
		yield put(actionTypes.pageSetFilter(pageName, pFilter, pSort));

		const pagerData = {
			...params,
			pageName,
			count,
			entityName: this.name,
		};

		const isPageNotExist =
			!pagination?.[pageName] ||
			!pagination?.[pageName]?.['pages']?.[params?.page ?? 0];
		if (isPageNotExist || params?.force) {
			const res = yield call(
				this.xRead,
				uri,
				'POST',
				pagerData,
				params.force || isPageNotExist,
			);

			return res;
		} else if (
			pagination?.[pageName] &&
			pagination?.[pageName]?.pages &&
			pagination?.[pageName]?.pages?.[params?.page || 0] &&
			pagination?.[pageName]?.currentPage !== params?.page
		) {
			yield put(
				actionTypes.setPagerParams(pageName, {
					...params,
					currentPage: params.page,
				}),
			);
		}
	}

	public static getPagerItems(
		pagerName: string,
		needConcatPages = false
	): any[] {
		const state:any = container.resolve("store").state ?? {};
		const pager = state["pagination"];
		if (has(pager, pagerName)) {
			const entityName = get(pager, [pagerName, "entityName"]);
			if (has(state, ["entities", entityName])) {
				const pageNumber = get(pager, [pagerName, "currentPage"]);
				const items = state["entities"][entityName];
				if (!needConcatPages) {
					if (get(pager, [pagerName, "pages", pageNumber])) {
						const ids: any[] = get(pager, [pagerName, "pages", pageNumber]);
						return ids
							.map(id => items[String(id)])
							.filter(item => item !== undefined && item !== null);
					}
				} else {
					let allItems: any[] = [];
					const pages = get(pager, [pagerName, "pages"]);

					if (pages) {
						for (const i of Object.keys(pages)) {
							const pageIds: any[] = pages[i];
							if (pageIds) {
								allItems = [
									...allItems,
									...pageIds.map(id => items[String(id)])
								];
							}
						}
					}

					return allItems.filter(item => item !== undefined && item !== null
					);
				}
			}
		}
		return [];
	}
	// public static getPagerItemsIds(
	// 	pagerName: string,
	// 	needConcatPages = false
	// ): any[] {
	// 	const state:any = container.resolve("store").state ?? {};
	// 	const pager = state["pagination"];
	// 	if (has(pager, pagerName)) {
	// 		const entityName = get(pager, [pagerName, "entityName"]);
	// 		if (has(state, ["entities", entityName])) {
	// 			const pageNumber = get(pager, [pagerName, "currentPage"]);
	// 			const items = state["entities"][entityName];
	// 			if (!needConcatPages) {
	// 				if (get(pager, [pagerName, "pages", pageNumber])) {
	// 					const ids: any[] = get(pager, [pagerName, "pages", pageNumber]);
	// 					return ids
	// 						.map(id => items[String(id)])
	// 						.filter(item => item !== undefined && item !== null);
	// 				}
	// 			} else {
	// 				let allItems: any[] = [];
	// 				const pages = get(pager, [pagerName, "pages"]);

	// 				if (pages) {
	// 					for (const i of Object.keys(pages)) {
	// 						const pageIds: any[] = pages[i];
	// 						if (pageIds) {
	// 							allItems = [
	// 								...allItems,
	// 								...pageIds.map(id => items[String(id)])
	// 							];
	// 						}
	// 					}
	// 				}

	// 				return allItems.filter(item => item !== undefined && item !== null
	// 				);
	// 			}
	// 		}
	// 	}
	// 	return [];
	// }
}
