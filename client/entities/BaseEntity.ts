/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnswerType, Response } from "@/types";
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
import { toast } from "react-toastify";

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

	protected watcher(name: string) {
		if (!(name in this)) throw new Error("Action not found : " + name);
		const worker = (this as any)[name].bind(this);
		return function* (): Generator<Effect> {
			const chan = yield actionChannel(name);
			while (true) {
				const { payload } = yield take(chan);
				try {
				yield call(worker, payload);
				} catch (e) {
					console.error('Error in saga Watcher', (e as Error).message);
					throw e;
				}
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
		// return actions
		// 	.map(name => di[name])
		// 	.filter(entity => entity instanceof BaseEntity)
		// .map(entity => entity.rootSaga.bind(entity));
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
			.map((action) => this.watcher(action));
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
			toast.error(text+': '+(e as Error).message);
			console.error('in actionRequest', (e as Error).message ?? e);
		}
	}

	public xRead(url?: string, method: "GET" | "POST" = "GET") {
		return this.actionRequest(method, url);
	}
	public xSave(url: string, body: any = {}) {
		return this.actionRequest("POST", url, body);
	}
	public xDelete(url?: string, method: "GET" | "POST" = "GET") {
		return this.actionRequest(method, url);
	}
}
