import {createContainer,InjectionMode, asFunction, asClass, asValue } from 'awilix';
import getSequelizeConnect from '../utils/db';
import UsersModel from "@/server/models/users";
import ClassesModel from "@/server/models/classes";
import SubjectsModel from "@/server/models/subjects";
import User_classesModel from "@/server/models/user_classes";
import JournalModel from "@/server/models/journal";
import SubjectsController from '@/server/controllers/SubjectsController';
import ClassesController from '@/server/controllers/ClassesController';
import config from '@/config';

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
  strict: true,
})
container.register({
  // sequelize: asFunction(getSequelizeConnect).singleton(),
  // Users: asFunction(UsersModel),
  // Classes: asFunction(ClassesModel),
  // Subjects: asFunction(SubjectsModel),
  // User_classes: asFunction(User_classesModel),
  // Journal: asFunction(JournalModel),
  // SubjectsController: asClass(SubjectsController).singleton(),
  // ClassesController: asClass(ClassesController).singleton(),
  config: asValue(config),
})
export default container;
