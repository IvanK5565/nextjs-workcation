import { HYDRATE } from "next-redux-wrapper";
import { Entities, EntitiesAction } from "./types";

function baseReducer<K extends keyof Entities>(collectionName: K) {

	return (collection: Entities[K] = {}, action: EntitiesAction): Entities[K] => {

		switch (action.type) {
			case 'DELETE_ALL': return {};
		}


		if (!action.payload || !action.payload[collectionName]) {
			return collection;
		}
		const newEntities = action.payload[collectionName];

		switch (action.type) {
			case HYDRATE:
			case "ADD":
				return { ...collection, ...newEntities };
			case "DELETE":
				console.warn('DELETE action: ' + newEntities)
				return Object.fromEntries(
					Object.entries(collection).filter((entry) => !Object.hasOwn(newEntities, entry[0]))
				);
		}

		return collection;
	};
}
export default baseReducer;
