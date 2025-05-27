/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "@/types";
import { normalize, Schema } from "normalizr";
import {
	actionChannel,
	all,
	call,
	Effect,
	fork,
	put,
	take,
} from "redux-saga/effects";
import { addEntities } from "../store/actions";
import baseReducer from "../store/baseReducer";
import { Entities } from "../store/types";
import { ActionInfo } from "./decorators";
import { IEntityContainer } from ".";
import { BaseContext } from "../context/BaseContext";
import { IClientContainer } from "../context/container";

export enum ENTITIES {
	USER = "users",
	CLASS = "classes",
	SUBJECT = "subjects",
}

export type EntityAction<E extends BaseEntity> = {
	type: keyof Omit<E, keyof BaseEntity>;
	payload?: any;
};

export type EntitiesName = keyof IEntityContainer;

export default abstract class BaseEntity extends BaseContext {
	protected abstract schema: Schema;
	// protected abstract name: ENTITIES;
	protected abstract name: EntitiesName;
	public foo = "bar";

	public getName = () => this.name;
	public getSchema = () => this.schema;
	public normalize = (data: object) =>
		normalize(data, Array.isArray(data) ? [this.schema] : this.schema);

	public createSagaWatcher(name: string) {
		if (!(name in this)) throw new Error("Action not found : " + name);
		const worker = (this as any)[name].bind(this);
		return function* (): Generator<Effect> {
			
			const chan = yield actionChannel(name);
			while (true) {
				const { payload } = yield take(chan);
				yield call(worker, payload);

				// const res =
				// if (res) {
				// 	const normalData = context.normalize(res.data);
				// 	yield put(addEntities(normalData.entities));
				// 	res.data = normalData.result;
				// 	yield put({ type: "NEW_RESPONSE", payload: res });
				// }
			}
		};
	}

	public *rootSaga(): Generator {
		const actions: ActionInfo[] =
		Reflect.getMetadata("actions", BaseEntity) ?? [];
		yield all(
			actions
				.filter((action) => action.methodName in this)
				.map((action) => fork(this.createSagaWatcher(action.methodName)))
		);
	}

	public sagas() {
		return BaseEntity.sagas(this.di);
	}
	public static sagas(di: IClientContainer) {
		const actions: ActionInfo[] =
			Reflect.getMetadata("actions", BaseEntity) ?? [];
		return actions.map(({ entityName, methodName }) =>
			di[entityName].createSagaWatcher(methodName)
		);
	}

	public static reducers() {
		const names: (keyof Entities)[] =
			Reflect.getMetadata("reducers", BaseEntity) ?? [];
		const reducers = names.reduce(
			(acc, name) => ({
				...acc,
				[name]: baseReducer(name),
			}),
			{} as Record<string, ReturnType<typeof baseReducer>>
		);
		return reducers;
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
			throw new Error("Request unsuccess: " + res.message);
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
				res.data = normalData.result;
				yield put({ type: "NEW_RESPONSE", payload: res });
			}
		} catch (e) {
			console.error((e as Error).message ?? e);
			yield put({ type: "Error", error: (e as Error).message });
		}
	}

	public xRead(url?: string, method: "GET" | "POST" = "GET") {
		// return BaseEntity.xFetch(url, method);
		return this.actionRequest(method, url);
	}
	public xSave(url: string, body: any = {}) {
		// return BaseEntity.xFetch(url, method, body);
		return this.actionRequest("POST", url, body);
	}
	public xDelete(url?: string, method: "GET" | "POST" = "GET") {
		// return BaseEntity.xFetch(url, method);
		return this.actionRequest(method, url);
	}
}
