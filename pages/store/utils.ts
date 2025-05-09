import { Entity } from "@/types";
import { EntityActionType } from "./types";

export function doActionOnEntities<T extends Entity>(dest:T[], actionType:EntityActionType, data:T|T[]){
  switch (actionType) {
		case EntityActionType.ADD: {
			return addEntity(dest, data);
		}
    case EntityActionType.REMOVE: {
      return removeEntity(dest, data);
		}
		default: {
			return dest;
		}
	}
}

export function addEntity<T extends Entity>(dest: T[], src: T | T[]) {
	src = Array.isArray(src) ? src : [src];
	const res = [...dest];
	src.forEach((srcUser) => {
		if (!res.find((u) => u.id === srcUser.id)) {
      res.push(srcUser);
    }
	});
  return res.sort((u1, u2) => u1.id - u2.id);
}

export function removeEntity<T extends Entity>(dest: T[], src: T | T[]) {
	src = Array.isArray(src) ? src : [src];
	const res:T[] = [];
	dest.forEach((u1) => {
		if (!src.find((u2) => u2.id === u1.id)) {
      res.push(u1);
    }
	});
  return res;
}

