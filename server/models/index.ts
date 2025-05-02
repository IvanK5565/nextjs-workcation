import { asFunction, AwilixContainer } from "awilix";
import UsersModel,{ Users, UsersType } from './users'
import ClassesModel, { Classes, ClassesType } from './classes'
import SubjectsModel, { Subjects, SubjectsType } from './subjects'
import UserClassesModel, { UserClasses, UserClassesType } from './userClasses'
import JournalModel, { Journal, JournalType } from './journal'
import IContextContainer from "../IContextContainer";

export interface IModelContainer {
  UsersModel: UsersType;
  ClassesModel: ClassesType;
  SubjectsModel: SubjectsType;
  UserClassesModel: UserClassesType;
  JournalModel: JournalType;
}

export {
  Users,
  Classes,
  Subjects,
  UserClasses,
  Journal,
}

export default {
  UsersModel: asFunction(UsersModel).singleton(),
  ClassesModel: asFunction(ClassesModel).singleton(),
  SubjectsModel: asFunction(SubjectsModel).singleton(),
  UserClassesModel: asFunction(UserClassesModel).singleton(),
  JournalModel: asFunction(JournalModel).singleton(),
};

export function associateModels(container: AwilixContainer<IContextContainer>) {
  // Associations

  const Users = container.resolve('UsersModel');
  const Classes = container.resolve('ClassesModel');
  const Subjects = container.resolve('SubjectsModel');
  const UserClasses = container.resolve('UserClassesModel');
  const Journal = container.resolve('JournalModel');

  Users.hasMany(Classes, { foreignKey: 'teacher_id', as: 'classes' }); // Assuming `teacher_id` exists in Classes table
  Users.belongsToMany(Classes, { through: UserClasses, foreignKey: 'student_id', as: 'student_classes' });
  Users.hasMany(Journal, { foreignKey: 'teacher_id', as: 'teachers_marks' });
  Users.hasMany(Journal, { foreignKey: 'student_id', as: 'students_marks' });

  Classes.belongsToMany(Users, { through: UserClasses, foreignKey: 'class_id', as: 'studentsInClass' });
  Classes.belongsTo(Users, { foreignKey: 'teacher_id', as: 'teacher' });
  Classes.hasMany(Journal, { foreignKey: 'class_id', as: 'class_marks', });
  
  Subjects.hasMany(Journal, { foreignKey: 'subject_id', as: 'subjects_marks' });
  
  Journal.belongsTo(Users, { foreignKey: 'student_id', as: 'student' });
  Journal.belongsTo(Subjects, { foreignKey: 'subject_id', as: 'subject' });
  Journal.belongsTo(Classes, { foreignKey: 'class_id', as: '_class' });
  Journal.belongsTo(Users, { foreignKey: 'teacher_id', as: 'teacher' });
}
