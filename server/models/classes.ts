import { Model, DataTypes } from 'sequelize';


export default function ClassesModel({sequelize, Journal, Users, User_classes}:any) {  
  const statusValues = ['draft', 'active', 'closed'];
  class Classes extends Model {}

Classes.init(
  {
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id', // assuming Users has an 'id' column as the primary key
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: statusValues,
      allowNull: false,
      validate: {
        isIn: [statusValues],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdAt',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updatedAt',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Classes',
    tableName: 'classes',
    timestamps: true,
    underscored: true,
  });
  
  Classes.belongsTo(Users, {
    foreignKey: 'teacher_id',
    as: 'teacher',
  });
  
  Classes.belongsToMany(Users, {
    through: User_classes,
    as: 'class_students',
    foreignKey: 'class_id',
  });
  
  Classes.hasMany(Journal, {
    foreignKey: 'class_id',
    as: 'class_marks',
  });
  
  return Classes;
}