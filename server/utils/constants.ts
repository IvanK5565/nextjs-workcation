export enum UserStatus{
  ACIVE = "active",
  BANNED = "banned",
  GRADUATED = "graduated",
  FIRED = 'fired',
};
export enum UserRole{
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
};
export enum ClassStatus{
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}
export enum LectureType{
  EXAM = 'exam',
  LESSON = 'lesson',
  HOMEWORK = 'homework'
}
export enum LectureStatus{
  MISSING = 'missing',
  CANCELLED = 'cancelled',
  SICK = 'sick',
  NOTHING = 'nothing',
}

export const SALT_ROUNDS = 10

export type StringRecord<T> = Record<string,T>
export const DEFAULT_LIMIT = 100;
export const DEFAULT_PAGE = 1;

