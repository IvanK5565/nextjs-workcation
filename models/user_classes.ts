import { 
  AutoIncrement, 
  Column, 
  CreatedAt, 
  DataType, 
  ForeignKey, 
  IsNumeric, 
  Model, 
  PrimaryKey, 
  Table, 
  UpdatedAt 
} from "sequelize-typescript";
import Classes from './classes';
import Users from './users';
import container from "@/utils/container";

@Table({
  tableName: 'user_classes',
  modelName: 'User_classes',
  timestamps: true,
})
class User_classes extends Model {
  @AutoIncrement
  @PrimaryKey
  @IsNumeric
  @Column({
    type: DataType.INTEGER,
    allowNull:false,
  })
  declare user_class_id: number;
  
  @IsNumeric
  @ForeignKey(()=>Classes)
  @Column({
    type: DataType.INTEGER,
    allowNull:false,
  })
  declare class_id: number;
  
  @IsNumeric
  @ForeignKey(()=>Users)
  @Column({
    type: DataType.INTEGER,
    allowNull:false,
  })
  declare student_id: number;
  
  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;
};

container.resolve('sequelize').addModels([User_classes]);

export default User_classes;
