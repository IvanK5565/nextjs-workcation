import { asClass } from "awilix";
import UsersService from "./UsersService";
import ClassesService from "./ClassesService";
import SubjectsService from "./SubjectsService";
import UserClassesService from "./UserClassesService";
import { StringMap } from "../utils/constants";

export interface IService {
  save(body:StringMap):Promise<any>;
  findById(id:Number):Promise<any>;
  findByFilter(limit: number, page: number, filters?: StringMap):Promise<any>;
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