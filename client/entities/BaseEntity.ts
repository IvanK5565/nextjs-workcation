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
import { IEntityContainer } from ".";
import { BaseContext } from "../context/BaseContext";
import { IClientContainer } from "../context/container";

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

	protected watcher(name: string) {
		if (!(name in this)) throw new Error("Action not found : " + name);
		const worker = (this as any)[name].bind(this);
		return function* (): Generator<Effect> {
			const chan = yield actionChannel(name);
			while (true) {
				const { payload } = yield take(chan);
				yield call(worker, payload);
			}
		};
	}

	public *rootSaga(): Generator<Effect> {
		const actions: string[] = Reflect.getMetadata("actions", this) ?? [];
		const sagas = actions
			.filter((action) => action in this)
			.map((action) => fork(this.watcher(action)));
		yield all(sagas);
	}
	public static sagas(di: IClientContainer) {
		const actions: (keyof IClientContainer)[] =
			Reflect.getMetadata("actions", BaseEntity) ?? [];
		return actions
		.map(name => di[name])
		.filter(entity => entity instanceof BaseEntity)
		.map(entity => entity.rootSaga.bind(entity));
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
