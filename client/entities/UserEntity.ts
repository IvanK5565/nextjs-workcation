/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { action, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import { put } from "redux-saga/effects";
import type { IPagerParams } from "../pagination/types";
import { Entities } from "../store/types";
import { signIn, signOut } from "next-auth/react";

export type UserAction = EntityAction<UserEntity>;

@reducer('users')
export default class UserEntity extends BaseEntity {
	protected schema;
	protected name: keyof Entities;

	constructor(di: IClientContainer) {
		super(di);
		const _class = new schema.Entity("classes");
		this.schema = new schema.Entity("users", {
			classes: [_class],
			userClasses: [_class],
		});
		this.name = 'users';
	}

	@action
	public *fetchAllUsers() {
		yield this.xRead("/users");
	}

	@action
	public *saveUser(payload: any) {
		const id = payload.id;
		yield this.xSave(`/users${id ? '/'+id : ''}`, payload);
	}

	@action
	public *fetchUserById(payload: {id:number|string}) {
		const id = payload.id;
		if (!id) throw new Error("Id required");
		yield this.xRead(`/users/${id}`);
	}

	@action
	public *register(payload: any) {
		console.log('register', payload)
		yield this.xSave(`/register`, payload)
	}

	@action
	public *deleteUser(payload: any) {
		if (!payload.id) throw new Error("Id required");
		const normalized = this.normalize(payload);
		yield put({ type: 'DELETE', payload: normalized.entities });
	}

	@action
	public *fetchUsersPage(data: IPagerParams) {
		yield this.pageEntity('/users/page', data);
	}

	@action
	public *signOut(redirect?:boolean){
		yield signOut({callbackUrl:'/signIn', redirect});
		yield this.di.persistor?.purge();
	}

	@action
	public *signIn(args:Parameters<typeof signIn>){
		yield signIn(...args);
		yield this.di.persistor?.purge();
	}
}