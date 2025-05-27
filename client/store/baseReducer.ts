import { HYDRATE } from "next-redux-wrapper";
import { Entities, EntitiesAction } from "./types";

function baseReducer<K extends keyof Entities>(collectionName: K) {
	return (state: Entities[K] = {}, action: EntitiesAction): Entities[K] => {
		if(action.type === 'DELETE_ALL') {
			return {};
		}
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
					Object.entries(state).filter((entry) => !(entry[0] in newEntities))
				);
			case "DELETE_ALL":
				return {};
			default:
				return state;
		}
	};
}
export default baseReducer;
