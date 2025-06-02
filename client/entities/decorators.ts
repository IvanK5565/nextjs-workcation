import "reflect-metadata";
import BaseEntity, { EntitiesName } from "./BaseEntity";
import { Entities } from "../store/types";
import { IClientContainer } from "../context/container";

/**
 * ActionInfo type represents the metadata for an action method.
 * It includes the method name and the entity name it belongs to.
 */
export type ActionInfo = {
	methodName: string;
	entityName: EntitiesName;
};

/**
 * Decorator to register an action method for an entity.
 * This will add the action method name to the metadata of the entity.
 * It also registers the entity name in the BaseEntity metadata.
 * 
 * @return A method decorator that registers the action.
 * @example
 * ```typescript
 * // @action
 * public *someAction() {
 *   // action logic
 * }
 * ...
 * const actions: string[] = Reflect.getMetadata("actions", BaseEntity);
 * // actions will contain 'someAction'
 * ```
 */
const action: MethodDecorator = (target, propertyKey) => {
	const actions: string[] =
		Reflect.getMetadata("actions", target) ?? [];
	actions.push(propertyKey.toString());
	Reflect.defineMetadata("actions", actions, target);

	const entityNames: (keyof IClientContainer)[] = Reflect.getMetadata('actions', BaseEntity) ?? [];
	// TODO : Check if the entity name is already registered
	const name = target.constructor.name as keyof IClientContainer;
	if(!entityNames.includes(name)) {
		entityNames.push(name);
	}
	Reflect.defineMetadata('actions', entityNames, BaseEntity);
};

/**
 * Decorator to register a reducer for an entity.
 * This will add the entity name to the BaseEntity metadata.
 * @param name - The name of the entity to be registered as a reducer.
 * @return A class decorator that registers the entity name.
 * @example
 * ```typescript
 * // @reducer('myEntity')
 * class MyEntity extends BaseEntity {
 *   // entity logic
 * }
 * ...
 * const reducers: (keyof Entities)[] = Reflect.getMetadata("reducers", BaseEntity);
 * // reducers will contain 'myEntity'
 * ```
 */
export const reducer: (name: keyof Entities) => ClassDecorator =
	(name) => () => {
		const reducers: (keyof Entities)[] =
			Reflect.getMetadata("reducers", BaseEntity) ?? [];
		Reflect.defineMetadata("reducers", [...reducers, name], BaseEntity);
	};

export { action };
