/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { ENTITIES, EntitiesName, EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { action, reducer } from "./decorators";
import type { IClientContainer } from "../context/container";

export type ClassAction = EntityAction<ClassEntity>

@reducer('classes')
export default class ClassEntity extends BaseEntity {
	protected schema;
	protected name:EntitiesName;

	constructor(di:IClientContainer) {
    super(di);
		const user = new schema.Entity("users");
		this.schema = new schema.Entity('classes',{
			teacher: user,
			studentsInClass: [user],
		},
    { idAttribute: 'id' });
		this.name = "ClassEntity";
	}

  @action
  public *getAllClasses(_payload:any){
    yield this.xRead("/classes");
  }

  @action
  public *saveClass(payload:any) {
		const id = payload.id;
		yield this.xSave(id ? `/classes/${id}` : "/classes", payload);
  }

	@action
	public *getClassById(payload:any) {
		const id = payload.id;
		if (!id) throw new Error("Id required");
		yield this.xRead(`/classes/${id}`);
	}
}