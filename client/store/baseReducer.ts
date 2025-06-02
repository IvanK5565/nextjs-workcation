import { HYDRATE } from "next-redux-wrapper";
import { Entities, EntitiesAction } from "./types";

function baseReducer<K extends keyof Entities>(collectionName: K) {

	const onUpdate = (collection: Entities[K] = {}, action: EntitiesAction): Entities[K] => {
		if(!action.payload?.entities || !action.payload.entities[collectionName]) {
			return collection
		}
		const updatedEntities = action.payload.entities[collectionName];
		Object.entries(updatedEntities).forEach(([id, entity]) => {
			if (!!entity) {
				collection[id] = entity;
				console.info(`Updated ${collectionName} with id ${id}`, entity);
			}
		});
		return collection;
	}

	return (collection: Entities[K] = {}, action: EntitiesAction): Entities[K] => {

		switch (action.type) {
			case 'DELETE_ALL': return {};
			case 'UPDATE': return onUpdate(collection, action);
		}


		if (!action.payload?.entities || !action.payload?.entities[collectionName]) {
			return collection;
		}
		const newEntities = action.payload.entities[collectionName];

		switch (action.type) {
			case HYDRATE:
				return { ...newEntities };
			case "ADD":
				return { ...collection, ...newEntities };
			case "DELETE":
				return Object.fromEntries(
					Object.entries(collection).filter((entry) => !Object.hasOwn(newEntities, entry[0]))
				);
		}

		return collection;
	};
}
export default baseReducer;
