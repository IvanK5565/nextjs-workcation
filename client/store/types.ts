import { UserRole, UserStatus, ClassStatus } from "@/constants";
export interface IUser {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	status: UserStatus;
	role: UserRole;
}
export interface ISubject{
  id: number;
  name: string;
  description: string;
}
export interface IClass{
  id: number,
  teacher_id: number,
  title: string,
  year: number,
  status: ClassStatus,
}
/** Normalizeed */
export type Entities = {
	users: Record<string, IUser>;
	classes: Record<string, IClass>;
	subjects: Record<string, ISubject>;
};

export type EntitiesAction = {
	// type: "ADD"|"DELETE"|'DELETE_ALL';
	type: string;
	payload?: Partial<Entities>;
};

/******** */
