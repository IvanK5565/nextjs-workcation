import { 
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  IsAlpha,
  IsNumeric,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import Journal from './journal';
import container from '@/utils/container';

@Table({
  tableName:"subjects",
  modelName:'Subjects',
  timestamps:true,
})
class Subjects extends Model {
  @PrimaryKey
  @AutoIncrement
  @IsNumeric
  @Column({
    type: DataType.INTEGER,
    allowNull:false,
  })
  declare subject_id: number;
  
  @IsAlpha
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare name: string;
  @IsAlpha
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description: string;
  
  @CreatedAt
  declare createdAt: Date;
  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(()=> Journal, 'subjects_marks')
  declare subjects_marks: Journal[];
}

container.resolve('sequelize').addModels([Subjects]);

export default Subjects;
