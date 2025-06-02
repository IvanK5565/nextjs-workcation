/* eslint-disable @typescript-eslint/no-explicit-any */
import { asClass } from "awilix";
import UsersService from "./UsersService";
import ClassesService from "./ClassesService";
import SubjectsService from "./SubjectsService";
import UserClassesService from "./UserClassesService";

export interface IService {
  save(body:Record<string,string>):Promise<any>;
  findById(id:number):Promise<any>;
  findByFilter(limit: number, page: number, filters?: Record<string,string>):Promise<any>;
  delete(id: number):Promise<any>;
}

export interface IServicesContainer {
  UsersService: UsersService;
  ClassesService: ClassesService;
  SubjectsService: SubjectsService;
  UserClassesService: UserClassesService;
}

const services = {
  UsersService: asClass(UsersService).singleton(),
  ClassesService: asClass(ClassesService).singleton(),
  SubjectsService: asClass(SubjectsService).singleton(),
  UserClassesService: asClass(UserClassesService).singleton(),
};
export default services;