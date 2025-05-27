/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { ENTITIES, EntitiesName, EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { action, reducer } from "./decorators";
import type { IClientContainer } from "../context/container";

export type UserAction = EntityAction<UserEntity>;

@reducer('users')
export default class UserEntity extends BaseEntity {
	protected schema;
		protected name:EntitiesName;

	constructor(di:IClientContainer) {
    super(di);
		const _class = new schema.Entity("classes");
		this.schema = new schema.Entity("users", {
			classes: [_class],
			userClasses: [_class],
		});
		this.name = 'UserEntity';
	}

	@action
	public *getAllUsers(_payload: any) {
		yield this.xRead("/users");
	}

	@action
	public *saveUser(payload: any) {
		const id = payload.id;
		yield this.xSave(id ? `/users/${id}` : "/users", payload);
	}

	@action
	public *getUserById(payload: any) {
		const id = payload.id;
		if (!id) throw new Error("Id required");
		yield this.xRead(`/users/${id}`);
	}

	@action
	public *register(payload: any){
		console.log('register',payload)
		yield this.xSave(`/register`, payload)
	}
}
