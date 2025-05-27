import { Model, DataTypes } from 'sequelize';
import IContextContainer from '@/server/container/IContextContainer';
import { LectureStatus, LectureType } from '@/constants';

export class Journal extends Model{
  declare id: number;
  declare student_id: number;
  declare subject_id: number;
  declare class_id: number;
  declare teacher_id: number;
  declare lecture_time: Date;
  declare lecture_type: LectureType;
  declare lecture_status: LectureStatus;
  declare mark_val: number;
}

export type JournalType = typeof Journal;

export default (ctx: IContextContainer) => {
  Journal.init(
    {
      id: {
        type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id', // assuming Users has an 'id' column as the primary key
      },
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Subjects',
        key: 'id', // assuming Subjects has an 'id' column as the primary key
      },
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id', // assuming Classes has a 'class_id' column as the primary key
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id', // assuming Users has an 'id' column as the primary key
      },
    },
    lecture_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lecture_type: {
      type: DataTypes.ENUM,
      values: Object.values(LectureType),
      allowNull: false,
    },
    lecture_status: {
      type: DataTypes.ENUM,
      values: Object.values(LectureStatus),
      allowNull: false,
    },
    mark_val: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: ctx.db,
    modelName: 'Journal',
    tableName: 'journal',
    timestamps: false,
    underscored: true,
  }
  );
  return Journal;
}