import { asClass } from "awilix";
import ClassEntity from "./ClassEntity";
import SubjectEntity from "./SubjectEntity";
import UserEntity from "./UserEntity";

export interface IEntityContainer{
  UserEntity: UserEntity,
  ClassEntity: ClassEntity,
  SubjectEntity: SubjectEntity,
}

export const entities = {
  UserEntity: asClass(UserEntity).singleton(),
  ClassEntity: asClass(ClassEntity).singleton(),
  SubjectEntity: asClass(SubjectEntity).singleton(),
}