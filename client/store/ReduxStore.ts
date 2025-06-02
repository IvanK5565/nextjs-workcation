import { createWrapper } from "next-redux-wrapper";
import { all, fork } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import { latestResponseReducer } from "./latestResponse";
import { combineReducers } from "redux";
import BaseEntity from "../entities/BaseEntity";
import { errorReducer } from ".";
import { BaseContext } from "../context/BaseContext";
import { IClientContainer } from "../context/container";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import { Entities } from "./types";
import baseReducer from "./baseReducer";
import { IEntityContainer } from "../entities";

export type AppStore = ReturnType<ReturnType<ReduxStore["getMakeStore"]>>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export class ReduxStore extends BaseContext {
	private _wrapper: ReturnType<typeof createWrapper>;
	private persistConfig;

	public get wrapper() {
		return this._wrapper;
	}

	constructor(di: IClientContainer) {
		super(di);
		this._wrapper = this.createWrapper();
		this.persistConfig = {
			key: "root",
			storage,
		};
	}

	public get useWrappedStore() {
		return this._wrapper.useWrappedStore;
	}
	public get getServerSideProps() {
		return this._wrapper.getServerSideProps;
	}
	public normalizer(name: keyof IEntityContainer): BaseEntity['normalize'] {
		const entity = this.di[name];
		return entity.normalize.bind(entity);
	}

	private *rootSaga() {		
		const sagas = BaseEntity.sagas(this.di).map(saga => fork(saga));
		// entitiesKeys.map((name) => {
		// 	const entity = this.di[name];
		// 	return fork(entity.rootSaga.bind(entity))
		// })
		yield all(sagas);
	}
	private reducers() {
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

	private getMakeStore() {
		const rootSaga = this.rootSaga.bind(this);
		const reducers = this.reducers();
		const makeStore = () => {
			const reducer = combineReducers({
				latestResponse: latestResponseReducer,
				entities: combineReducers(reducers),
				error: errorReducer,
			});
			const persistedReducer = persistReducer(this.persistConfig, reducer);
			const sagaMiddleware = createSagaMiddleware();
			const store = configureStore({
				reducer: persistedReducer,
				middleware: (gDM) =>
					gDM({
						thunk: false,
						serializableCheck: {
							ignoredActions: [
								FLUSH,
								REHYDRATE,
								PAUSE,
								PERSIST,
								PURGE,
								REGISTER,
							],
						},
					}).concat(sagaMiddleware /*, logger*/),
				devTools: true,
			});
			const saga = sagaMiddleware.run(rootSaga);
			const persistor = persistStore(store);
			return {
				...store,
				__persistor: persistor,
				sagaTask: saga,
			};
		};
		return makeStore;
	}

	private createWrapper() {
		const makeStore = this.getMakeStore();
		return createWrapper(makeStore);
	}
}
