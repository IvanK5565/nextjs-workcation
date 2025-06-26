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
	Persistor,
} from 'redux-persist'
import storage from "redux-persist/lib/storage";
import { Entities, IClass, ISubject, IUser } from "./types";
import entityReducer from "./entityReducer";
import { IEntityContainer } from "../entities";
import /*authReducer,*/ { authReducerContainer, AuthState } from "../auth/authReducer";
import paginationReducer from "./paginationReducer";

export type AppStore = ReturnType<ReturnType<ReduxStore["getMakeStore"]>>;
export type AppState = ReturnType<AppStore["getState"]> & {
	users: Record<string, IUser>;
	classes: Record<string, IClass>;
	subjects: Record<string, ISubject>;
};
export type AppDispatch = AppStore["dispatch"];

export class ReduxStore extends BaseContext {
	private mWrapper: ReturnType<typeof createWrapper>;
	private persistConfig;
	private mState?: AppState;
	private mPersistor?:Persistor;
	public get state() {
		return this.mState;
	}

	public get wrapper() {
		return this.mWrapper;
	}
	public get persistor(){
		return this.mPersistor;
	}

	constructor(di: IClientContainer) {
		super(di);
		this.mWrapper = this.createWrapper();
		this.persistConfig = {
			key: "root",
			storage,
		};
	}

	public updateGuard(auth:AuthState){
		const {roles, rules} = auth;
		const role = auth.identity.role;
		this.di.guard.update(roles, rules, role);
	}

	public get useWrappedStore() {
		return this.mWrapper.useWrappedStore;
	}
	public get getServerSideProps() {
		return this.mWrapper.getServerSideProps;
	}
	public normalizer(name: keyof IEntityContainer): BaseEntity['normalize'] {
		const entity = this.di[name];
		return entity.normalize.bind(entity);
	}

	private *rootSaga() {
		const sagas = BaseEntity.sagas(this.di).map(saga => fork(saga));
		yield all([
			...sagas,
		]);
	}
	private reducers() {
		const names: (keyof Entities)[] =
			Reflect.getMetadata("reducers", BaseEntity) ?? [];
		const reducers = names.reduce(
			(acc, name) => ({
				...acc,
				[name]: entityReducer(name),
			}),
			{} as Record<string, ReturnType<typeof entityReducer>>
		);
		return reducers;
	}

	private getMakeStore() {
		const rootSaga = this.rootSaga.bind(this);
		const reducers = this.reducers();
		const makeStore = () => {
			const reducer = combineReducers({
				entities: combineReducers(reducers),
				// ...reducers,
				error: errorReducer,
				// auth: authReducer,
				auth: authReducerContainer(this.di),
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
			this.mPersistor = persistor;
			const state = {
				...store,
				__persistor: persistor,
				sagaTask: saga,
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.mState = state as any;
			return state;
		};
		return makeStore;
	}

	private createWrapper() {
		const makeStore = this.getMakeStore();
		return createWrapper(makeStore);
	}
}
