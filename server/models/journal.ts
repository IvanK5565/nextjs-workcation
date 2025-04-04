import { Model, DataTypes } from 'sequelize';

export default function JournalModel({sequelize}:any) {
  
  class Journal extends Model {}

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
        key: 'class_id', // assuming Classes has a 'class_id' column as the primary key
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
      values: ['exam', 'lesson', 'homework'],
      allowNull: false,
    },
    lecture_status: {
      type: DataTypes.ENUM,
      values: ['missing', 'cancelled', 'sick', 'nothing'],
      allowNull: false,
    },
    mark_val: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updatedAt',
    },
  },
  {
    sequelize,
    modelName: 'Journal',
    tableName: 'journal',
    timestamps: true,
    underscored: true,
  }
  );
  
  // Associations
  // Journal.belongsTo(sequelize.models.Users, { foreignKey: 'student_id', as: 'student' });
  // Journal.belongsTo(sequelize.models.Subjects, { foreignKey: 'subject_id', as: 'subject' });
  // Journal.belongsTo(sequelize.models.Classes, { foreignKey: 'class_id', as: '_class' });
  // Journal.belongsTo(sequelize.models.Users, { foreignKey: 'teacher_id', as: 'teacher' });  

  return Journal;
}