import { 
  AutoIncrement, 
  BelongsToMany, 
  Column, 
  CreatedAt, 
  DataType, 
  HasMany, 
  Is, 
  IsAlpha, 
  IsAlphanumeric, 
  IsEmail, 
  IsNumeric, 
  Model, 
  PrimaryKey, 
  Table, 
  UpdatedAt 
} from "sequelize-typescript";
import Classes from "./classes";
import User_classes from "./user_classes";
import Journal from "./journal";
import container from "@/utils/container";

const statusValues = ['admin', 'teacher', 'student'];
const roleValues = ['active', 'banned', 'graduated', 'fired'];

@Table({
  tableName: 'users',
  modelName: 'Users',
  timestamps: true,
})
class Users extends Model{
  @IsNumeric
  @AutoIncrement
  @PrimaryKey
  @Column({
    allowNull:false,
    type: DataType.INTEGER,
  })
  declare user_id: number;

  @IsAlpha
  @Column({
    allowNull:false,
    type: DataType.STRING,
  })
  declare first_name: string;
  
  @IsAlpha
  @Column({
    allowNull:false,
    type: DataType.STRING,
  })
  declare last_name: string

  @IsEmail
  @Column({
    allowNull:false,
    type: DataType.STRING,
  })
  declare email: string

  @IsAlphanumeric
  @Column({
    allowNull:false,
    type: DataType.STRING,
  })
  declare password: string
  
  
  @Is(function UserStatusValidator(value:string):void {
    if(!statusValues.includes(value)){
      throw new Error(`No status "${value}". Statuses: 'active', 'banned', 'graduated', 'fired'`);
    }
  })
  @Column({
    allowNull:false,
    type: DataType.ENUM,
    values: statusValues,
  })
  declare status: string

  @Is(function UserRoleValidator(value:string):void {
    if(!roleValues.includes(value)){
      throw new Error(`No role "${value}". Roles: 'admin', 'teacher', 'student'`);
    }
  })
  @Column({
    allowNull:false,
    type: DataType.ENUM,
    values: roleValues,
  })
  declare role: string

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => Classes)
  declare classes: Classes[];

  @BelongsToMany(()=>Classes,()=>User_classes)
  declare student_classes: Classes[];

  @HasMany(()=>Journal, 'teachers_id')
  declare teachers_marks: Journal[]

  @HasMany(()=>Journal, 'students_id')
  declare students_marks: Journal[]
}

container.resolve('sequelize').addModels([Users]);

export default Users;