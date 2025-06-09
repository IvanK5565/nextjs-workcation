/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { Entities, EntitiesAction } from "../types";
import { HYDRATE } from "next-redux-wrapper";

export const usersSlice = createSlice({
  name: 'users',
  initialState:{} as Entities['users'],
  reducers: baseR('users')
})

type Reducer<K extends keyof Entities> = (state:Entities[K] | undefined, action:EntitiesAction) => void;
type Reducers<K extends keyof Entities> = {
  HYDRATE: Reducer<K>,
  add: Reducer<K>,
  delete: Reducer<K>,
  deleteAll: Reducer<K>,
}

function baseReducer<K extends keyof Entities>(collectionName: K) {
	return (state: Entities[K] = {}, action: EntitiesAction): Entities[K] => {
		if (!action.payload?.entities || !action.payload?.entities[collectionName])
			return state;
		const newEntities = action.payload.entities[collectionName];
		switch (action.type) {
			case HYDRATE:
				return {...newEntities};
			case "ADD":
				return { ...state, ...newEntities };
			case "DELETE":
				return Object.fromEntries(
					Object.entries(state).filter(([key, _val]) => !(key in newEntities))
				);
			case "DELETE_ALL":
				return {};
			default:
				return state;
		}
	};
}


function baseR<K extends keyof Entities>(collectionName: K):Reducers<K> {
  return {
    HYDRATE: (state = {}, action) => {
      const newEntities = action.payload?.entities[collectionName];
      if (newEntities){
        state = newEntities;
      }
    },
    add: (state = {}, action) => {
      const newEntities = action.payload?.entities[collectionName];
      if (newEntities){
        Object.assign(state, newEntities);
      }
    },
    delete: (state = {}, action) => {
      const newEntities = action.payload?.entities[collectionName];
      if (newEntities){
        state = Object.fromEntries(
					Object.entries(state).filter(([key, _val]) => !(key in newEntities))
				);
      }
    },
    deleteAll: (state = {}, action) => {
      const newEntities = action.payload?.entities[collectionName];
      if (newEntities){
        state = {};
      }
    }
  }
}