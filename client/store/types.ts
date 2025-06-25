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
	users: Record<number, IUser>;
	classes: Record<number, IClass>;
	subjects: Record<number, ISubject>;
};

export type EntitiesAction = {
	// type: "ADD"|"DELETE"|'DELETE_ALL';
	type: string;
	payload?: Partial<Entities>;
};

/******** */

/******* Experiment ********/

type TEntity<T> = {
	count?:number;
	[id:number]:T;
}

export type _Entities = {
	users: TEntity<IUser>;
	classes: TEntity<IClass>;
	subjects: TEntity<ISubject>;
};