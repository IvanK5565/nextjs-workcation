import { schema } from "normalizr";
import { call, Effect } from "redux-saga/effects";
import { Response } from "@/types";

const schemaDecorator =
	(schema: schema.Entity): MethodDecorator =>
	(target, propertyKey) => {
		Reflect.defineMetadata("entity:schema", schema, target, propertyKey);
	};

const userSchema = () => {
	const _class = new schema.Entity("classes");
	const user = new schema.Entity("users", {
		classes: [_class],
		userClasses: [_class],
	});
	return schemaDecorator(user);
};
const classSchema = () => {
	const user = new schema.Entity("users");
	const _class = new schema.Entity(
		"classes",
		{
			teacher: user,
			studentsInClass: [user],
		},
		{ idAttribute: "id" }
	);
	return schemaDecorator(_class);
};
const subjectSchema = () => schemaDecorator(new schema.Entity("subjects"));

export type Action = {
	type: keyof Omit<Actions, keyof AbstractAction>;
	payload?: any;
};

abstract class AbstractAction {}

async function xFetch(url?: string, method?: "GET" | "POST", body?: any) {
	if (!url || !method) throw new Error("xFetch: no url");
	const res = (await fetch("/api/" + url, {
		method,
		body,
	}).then((data) => data.json())) as Response;
	if (!res.success) {
		throw new Error("Request unsuccess: " + res.message);
	} else {
		return res;
	}
}

const xRead = (url?: string, method: "GET" | "POST" = "GET") =>
	xFetch(url, method);
const xSave = (url?: string, body: any = {}, method: "GET" | "POST" = "POST") =>
	xFetch(url, method, body);
const xDelete = (url?: string, method: "GET" | "POST" = "GET") =>
	xFetch(url, method);

class Actions extends AbstractAction {
	@userSchema()
	public *getAllUsers(_payload: any): Generator<Effect> {
		return yield call(xRead, "/users");
	}

	@userSchema()
	public *saveUser(payload: any): Generator<Effect> {
		const id = payload.id;
		return yield call(xSave, id ? `/users/${id}` : "/users", payload);
	}

	@userSchema()
	public *getUserById(payload: any): Generator<Effect> {
		const id = payload.id;
		if (!id) throw new Error("Id required");
		return yield call(xRead, `/users/${id}`);
	}

	@subjectSchema()
	public *getAllSubjects(_payload: any): Generator<Effect> {
		return yield call(xRead, "/subjects");
	}

	@subjectSchema()
	public *saveSubject(payload: any): Generator<Effect> {
		const id = payload.id;
		return yield call(xSave, id ? `/subjects/${id}` : "/subjects", payload);
	}

	@subjectSchema()
	public *getSubjectById(payload: any): Generator<Effect> {
		const id = payload.id;
		if (!id) throw new Error("Id required");
		return yield call(xRead, `/subjects/${id}`);
	}

	@classSchema()
	public *getAllClasses(_payload: any): Generator<Effect> {
		return yield call(xRead, "/classes");
	}

	@classSchema()
	public *saveClass(payload: any): Generator<Effect> {
		const id = payload.id;
		return yield call(xSave, id ? `/classes/${id}` : "/classes", payload);
	}

	@classSchema()
	public *getClassById(payload: any): Generator<Effect> {
		const id = payload.id;
		if (!id) throw new Error("Id required");
		return yield call(xRead, `/classes/${id}`);
	}
}
