// import createSagaMiddleware from "redux-saga";
// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { latestResponseReducer } from "./latestResponse";
// import { all, fork } from "redux-saga/effects";
// import logger from 'redux-logger'
// import UserEntity from "../entities/UserEntity";
// import ClassEntity from "../entities/ClassEntity";
// import SubjectEntity from "../entities/SubjectEntity";
// import baseReducer from "./baseReducer";
// import { createWrapper } from "next-redux-wrapper";
// import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import container from "../context/container";
export const errorReducer = (error: string = "", action: { type: string; payload?: string }) =>
action.type === "Error" && !!action.payload ? action.payload : error;

export const redux = container.resolve('store');

// const entitiesReducer = combineReducers({
// 	users: baseReducer("users"),
// 	classes: baseReducer("classes"),
// 	subjects: baseReducer("subjects"),
// });

// const userEntity = container.resolve('UserEntity');
// const classEntity = container.resolve('ClassEntity');
// const subjectEntity = container.resolve('SubjectEntity');

// // const userEntity = container.resolve('userEntity');
// // const classEntity = container.resolve('classEntity');
// // const subjectEntity = container.resolve('subjectEntity');

// // function* rootSaga() {
// // 	yield all(BaseEntity.sagas());
// // }


// function* rootSaga() {
// 	console.log('root saga')
// 	yield all([
// 		// fork(userEntity.rootSaga),
// 		// fork(classEntity.rootSaga),
// 		// fork(subjectEntity.rootSaga),
// 		container.resolve('sagas')
// 	]);
// }

// const sagaMiddleware = createSagaMiddleware();

// const rootReducer = combineReducers({
// 			latestResponse: latestResponseReducer,
// 			entities: entitiesReducer,
// 			error: errorReducer,
// })
// const persistConfig = {
//   key: 'root',
//   storage,
// }
// const makeStore = () => {
// 	const store = configureStore({
// 		reducer: persistReducer(persistConfig,rootReducer),
// 		middleware: (gDM) => gDM({ thunk: false }).concat(logger,sagaMiddleware),
// 		devTools: true,
// 	});
// 	console.log('before start rootsaga')
// 	sagaMiddleware.run(rootSaga);
	
// 	return Object.assign(store, {__persistor:persistStore(store)});
// };
// export type AppStore = ReturnType<typeof makeStore>;
// export type AppState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];

// export const useAppDispatch = () => useDispatch<AppDispatch>();

// export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

// export const wrapper = createWrapper<AppStore>(makeStore);



