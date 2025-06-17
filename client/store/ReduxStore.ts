import { createWrapper } from "next-redux-wrapper";
import { all, fork } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import BaseEntity from "../entities/BaseEntity";
import { errorReducer } from "./errorReducer";
import { BaseContext } from "../di/BaseContext";
import { IClientContainer } from "../di/container";
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
import { Entities, IClass, ISubject, IUser } from "./types";
import baseReducer from "./baseReducer";
import { IEntityContainer } from "../entities";
import authReducer from "./authReducer";
import paginationReducer from "./paginationReducer";

export type AppStore = ReturnType<ReturnType<ReduxStore["getMakeStore"]>>;
export type AppState = ReturnType<AppStore["getState"]> & {
	users: Record<string,IUser>;
	classes: Record<string,IClass>;
	subjects: Record<string,ISubject>;
};
export type AppDispatch = AppStore["dispatch"];

export class ReduxStore extends BaseContext {
	private _wrapper: ReturnType<typeof createWrapper>;
	private persistConfig;
	private _state?:AppState;
	public get state(){
		return this._state;
	}
	
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
				// entities: combineReducers(reducers),
				...reducers,
				error: errorReducer,
				auth: authReducer,
				pagination: paginationReducer,
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
			const state = {
				...store,
				__persistor: persistor,
				sagaTask: saga,
			};
			this._state = state as any;
			return state;
		};
		return makeStore;
	}

	private createWrapper() {
		const makeStore = this.getMakeStore();
		return createWrapper(makeStore);
	}
}
