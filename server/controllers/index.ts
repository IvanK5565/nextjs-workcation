import { asClass } from "awilix";
import UsersController from "./UsersController";
import ClassesController from "./ClassesController";
import SubjectsController from "./SubjectsController";
import UserClassesController from "./UserClassesController";

export interface IControllerContainer {
  UsersController: UsersController;
  ClassesController: ClassesController;
  SubjectsController: SubjectsController;
  UserClassesController: UserClassesController;
}

export default {
  UsersController: asClass(UsersController).singleton(),
  ClassesController: asClass(ClassesController).singleton(),
  SubjectsController: asClass(SubjectsController).singleton(),
  UserClassesController: asClass(UserClassesController).singleton(),
};