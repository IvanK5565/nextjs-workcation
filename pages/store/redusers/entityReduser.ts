import { EntityActionType } from "../types";
import { addEntity, removeEntity } from "../utils";
import { Entity } from "@/types";

export function entityReduser<T extends Entity>(dest:T[], actionType:string, data?:T|T[]){
  if(!data) return dest;
  switch (actionType) {
		case EntityActionType.ADD: 
			return addEntity(dest, data);
		
    case EntityActionType.REMOVE: 
      return removeEntity(dest, data);
		
		default: 
			return dest;
		
	}
}