import { AuthType, IIdentity, ROLE } from "./acl/types";

export enum UserStatus {
  ACTIVE = "active",
  BANNED = "banned",
  GRADUATED = "graduated",
  FIRED = 'fired',
};
export enum UserRole {
  GUEST = 'guest',
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
};
export enum ClassStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}
export enum LectureType {
  EXAM = 'exam',
  LESSON = 'lesson',
  HOMEWORK = 'homework'
}
export enum LectureStatus {
  MISSING = 'missing',
  CANCELLED = 'cancelled',
  SICK = 'sick',
  NOTHING = 'nothing',
}

export const SALT_ROUNDS = 10

export const DEFAULT_LIMIT = 1000;
export const DEFAULT_PAGE = 1;

export enum TimesInMS {
  SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * DAY,
  YEAR = DAY * 365,
  LAEPYEAR = YEAR + 1,
}

export const DEFAULT_PER_PAGE = 10;


export const GUEST_IDENTITY: IIdentity = {
  email: 'guest',
  authType: AuthType.Default,
  id: 0,
  role: ROLE.GUEST,
} 