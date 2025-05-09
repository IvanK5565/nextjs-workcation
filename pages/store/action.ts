import { User } from "@/server/models";
import { EntityAction, EntityActionType } from "./types";

export function AddUsers(
	entity: User | User[]
) {
	return {
		type: EntityActionType.ADD,
		users: entity,
	};
}

export function RemoveEntities(
	entity: User | User[]
): EntityAction {
	return {
		type: EntityActionType.ADD,
		users: entity,
	};
}
