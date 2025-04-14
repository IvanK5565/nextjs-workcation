import { asClass } from "awilix";
import UsersService from "./UsersService";
import ClassesService from "./ClassesService";
import SubjectsService from "./SubjectsService";
import UserClassesService from "./UserClassesService";
import { FilterType } from "../constants";

export interface IService {
  save(body:FilterType):Promise<any>;
  findById(id:Number):Promise<any>;
  findByFilter(limit: number, page: number, filters?: FilterType):Promise<any>;
  delete(id: Number):Promise<any>;
}

export interface IServicesContainer {
  UsersService: UsersService;
  ClassesService: ClassesService;
  SubjectsService: SubjectsService;
  UserClassesService: UserClassesService;
}

export default {
  UsersService: asClass(UsersService).singleton(),
  ClassesService: asClass(ClassesService).singleton(),
  SubjectsService: asClass(SubjectsService).singleton(),
  UserClassesService: asClass(UserClassesService).singleton(),
};