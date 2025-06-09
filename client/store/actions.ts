import { Entities, EntitiesAction } from "./types";

type EntitiesActionFactory = (e: Partial<Entities>) => EntitiesAction;

export const addEntities: EntitiesActionFactory = (entities) => ({
	type: "ADD",
	payload: entities,
});

export const deleteEntities: EntitiesActionFactory = (entities) => ({
	type: "DELETE",
	payload: entities,
});