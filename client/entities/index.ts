import { asClass } from "awilix";
import ClassEntity from "./ClassEntity";
import SubjectEntity from "./SubjectEntity";
import UserEntity from "./UserEntity";

export interface IEntityContainer{
  UserEntity: UserEntity,
  ClassEntity: ClassEntity,
  SubjectEntity: SubjectEntity,
}

const entities = {
  [UserEntity.name]: asClass(UserEntity).singleton(),
  [ClassEntity.name]: asClass(ClassEntity).singleton(),
  [SubjectEntity.name]: asClass(SubjectEntity).singleton(),
}


export { entities };