/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { EntitiesName, EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { action, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import { addEntities } from "../store/actions";
import { put } from "redux-saga/effects";

export type SubjectAction = EntityAction<SubjectEntity>;

@reducer('subjects')
export default class SubjectEntity extends BaseEntity {
	protected schema;
	protected name: EntitiesName;

	constructor(di: IClientContainer) {
		super(di);
		this.schema = new schema.Entity("subjects");
		this.name = 'SubjectEntity';
	}

	@action
	public *getAllSubjects() {
		yield this.xRead("/subjects");
	}

	@action
	public *saveSubject(payload: any) {
		const id = payload.id;
		yield this.xSave(id ? `/subjects/${id}` : "/subjects", payload);
	}

	@action
	public *getSubjectById(payload: {id:string}) {
		const id = payload.id;
		if (!id) throw new Error("Id required");
		yield this.xRead(`/subjects/${id}`);
	}

	@action
	public *deleteSubject(payload: any) {
		if (!payload.id) throw new Error("Id required");
		const normalized = this.normalize(payload);
		yield put({type:'DELETE', payload:normalized.entities});
	}
}
