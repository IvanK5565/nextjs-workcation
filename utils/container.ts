import * as awilix from 'awilix';
import getSequelizeConnect from './db';
import { asFunction } from 'awilix';
import Users from "@/models/users";
import Classes from "@/models/classes";
import Subjects from "@/models/subjects";
import User_classes from "@/models/user_classes";
import Journal from "@/models/journal";

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
  strict: true,
})
container.register({
  sequelize: asFunction(getSequelizeConnect).singleton(),
  UsersModel: awilix.asValue(Users),
  ClassesModel: awilix.asValue(Classes),
  SubjectsModel: awilix.asValue(Subjects),
  User_classesModel: awilix.asValue(User_classes),
  JournalModel: awilix.asValue(Journal),
})
export default container;
