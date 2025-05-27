import { createWrapper } from "next-redux-wrapper";
import { all } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import { latestResponseReducer } from "./latestResponse";
import { combineReducers } from "redux";
import BaseEntity from "../entities/BaseEntity";
import logger from "redux-logger";
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

	private getMakeStore() {
		const di = this.di;
		const makeStore = () => {
			const rootSaga = function* () {
				yield all(di.sagas);
			};
			const reducer = combineReducers({
				latestResponse: latestResponseReducer,
				entities: combineReducers(BaseEntity.reducers()),
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
					}).concat(sagaMiddleware, logger),
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
