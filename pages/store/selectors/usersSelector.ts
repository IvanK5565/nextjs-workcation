import { User } from "@/server/models";
import { State } from "../types";

type FindSelector = (state: State) => User | undefined;
export function selectOneById(id: number): FindSelector {
	return (state) => state.users.find((u) => u.id == id);
}
