import { HYDRATE } from "next-redux-wrapper";
import { Entities, EntitiesAction } from "./types";
import { ADD_ENTITIES, DELETE_ENTITIES } from "./actionTypes";

function entityReducer<K extends keyof Entities>(collectionName: K) {

	return (collection: Entities[K] = {}, action: EntitiesAction): Entities[K] => {

		switch (action.type) {
			case 'DELETE_ALL': return {};
			// case 'UPDATE_ENTITY':{
			// 	if(action.payload && action.payload[collectionName]){
			// 		const newValues = action.payload[collectionName] as Entities[K];
			// 		Object.entries(newValues).forEach(([key,value]) => {
			// 			collection[parseInt(key)] = value;
			// 		})
			// 	}
			// 	return collection;
			// }
		}


		if (!action.payload || !action.payload[collectionName]) {
			return collection;
		}
		const newEntities = action.payload[collectionName];

		switch (action.type) {
			case HYDRATE:
			case ADD_ENTITIES:
				return { ...collection, ...newEntities };
			case DELETE_ENTITIES:
				console.warn('DELETE action: ' + newEntities)
				return Object.fromEntries(
					Object.entries(collection).filter((entry) => !Object.hasOwn(newEntities, entry[0]))
				);
		}

		return collection;
	};
}
export default entityReducer;
