import {
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Is,
  IsAlpha,
  IsNumeric,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from "sequelize-typescript";
import { AwilixContainer } from "awilix";
import Journal from "./journal";
import User_classes from "./user_classes";
import Users from "./users";

const statusValues = ['draft', 'active', 'closed'];

@Table({
  tableName: 'classes',
  modelName: 'Classes',
  timestamps: true,
})
export default class Classes extends Model {
  @IsNumeric
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER
  })
  declare class_id: number;

  @IsNumeric
  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare teacher_id: number;

  @IsAlpha
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @IsNumeric
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare year: number;

  @Is(function Class_Status_Validate(value: string): void{
    if(!statusValues.includes(value)){
      throw new Error(`No status "${value}". Statuses: 'draft', 'active', 'closed'.`);
    }
  })
  @Column({
    allowNull: false,
    type: DataType.ENUM,
    values: statusValues,
  })
  declare status: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @BelongsToMany(() => Users, () => User_classes)
  declare class_students: typeof Users[];

  @HasMany(()=>Journal, 'class_id')
  declare class_marks: Journal[]

  private static ctx:AwilixContainer;
  constructor(ctx:AwilixContainer){
    super();
    Classes.ctx = ctx;
  }
}
