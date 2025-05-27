import "reflect-metadata";
import BaseEntity, { EntitiesName } from "./BaseEntity";
import { Entities } from "../store/types";

export type ActionInfo = {
	methodName: string;
	entityName: EntitiesName;
};
const action: MethodDecorator = (target, propertyKey) => {
	const actions: ActionInfo[] =
		Reflect.getMetadata("actions", BaseEntity) ?? [];
	actions.push({
		entityName: target.constructor.name as EntitiesName,
		methodName: propertyKey.toString(),
	});
	Reflect.defineMetadata("actions", actions, BaseEntity);
};

export const reducer: (name: keyof Entities) => ClassDecorator =
	(name) => () => {
		const reducers: (keyof Entities)[] =
			Reflect.getMetadata("reducers", BaseEntity) ?? [];
		Reflect.defineMetadata("reducers", [...reducers, name], BaseEntity);
	};

export { action };
