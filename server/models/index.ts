import { asFunction, AwilixContainer } from "awilix";
import UserModel,{ User, UserType } from './users'
import ClassesModel, { Classes, ClassesType } from './classes'
import SubjectsModel, { Subjects, SubjectsType } from './subjects'
import UserClassesModel, { UserClasses, UserClassesType } from './userClasses'
import JournalModel, { Journal, JournalType } from './journal'
import IContextContainer from "@/server/container/IContextContainer";

export interface IModelContainer {
  UserModel: UserType;
  ClassesModel: ClassesType;
  SubjectsModel: SubjectsType;
  UserClassesModel: UserClassesType;
  JournalModel: JournalType;
}

export {
  User,
  Classes,
  Subjects,
  UserClasses,
  Journal,
}

export default {
  UserModel: asFunction(UserModel).singleton(),
  ClassesModel: asFunction(ClassesModel).singleton(),
  SubjectsModel: asFunction(SubjectsModel).singleton(),
  UserClassesModel: asFunction(UserClassesModel).singleton(),
  JournalModel: asFunction(JournalModel).singleton(),
};

export function associateModels(container: AwilixContainer<IContextContainer>) {
  // Associations

  const User = container.resolve('UserModel');
  const Classes = container.resolve('ClassesModel');
  const Subjects = container.resolve('SubjectsModel');
  const UserClasses = container.resolve('UserClassesModel');
  const Journal = container.resolve('JournalModel');

  User.hasMany(Classes, { foreignKey: 'teacher_id', as: 'classes' }); // Assuming `teacher_id` exists in Classes table
  User.belongsToMany(Classes, { through: UserClasses, foreignKey: 'student_id', as: 'userClasses' });
  User.hasMany(Journal, { foreignKey: 'teacher_id', as: 'teachers_marks' });
  User.hasMany(Journal, { foreignKey: 'student_id', as: 'students_marks' });

  Classes.belongsToMany(User, { through: UserClasses, foreignKey: 'class_id', as: 'studentsInClass' });
  Classes.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
  Classes.hasMany(Journal, { foreignKey: 'class_id', as: 'classMarks', });
  
  Subjects.hasMany(Journal, { foreignKey: 'subject_id', as: 'subjectsMarks' });
  
  Journal.belongsTo(User, { foreignKey: 'student_id', as: 'student' });
  Journal.belongsTo(Subjects, { foreignKey: 'subject_id', as: 'subject' });
  Journal.belongsTo(Classes, { foreignKey: 'class_id', as: '_class' });
  Journal.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });
}
