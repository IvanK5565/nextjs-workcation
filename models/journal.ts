import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import Classes from './classes';
import Subjects from './subjects';
import Users from './users';
import container from '@/utils/container';

@Table({
  tableName: 'journal',
  modelName: 'Journal',
  timestamps: true,
})
class Journal extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare id: number;
  //FK
  @ForeignKey(()=>Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare student_id: number;
  @ForeignKey(()=>Subjects)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare subject_id: number;
  @ForeignKey(()=>Classes)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare class_id: number;
  @ForeignKey(()=>Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
//associations
  declare teacher_id: number;
  @BelongsTo(()=> Users, 'students_id')
  declare student: Users;
  @BelongsTo(()=> Subjects, 'subject_id')
  declare subject: Subjects;
  @BelongsTo(()=> Classes, 'class_id')
  declare _class: Classes;
  @BelongsTo(()=> Users, 'teachers_id')
  declare teacher: Users;
  
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare lecture_time: Date;
  //others
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['exam', 'lesson', 'homework']
  })
  declare lecture_type: string;
  
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ['missing', 'cancelled', 'sick', 'nothing']
  })
  declare lecture_status: string;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare mark_val: number;
//timestamps
  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;
}

container.resolve('sequelize').addModels([Journal]);

export default Journal;
