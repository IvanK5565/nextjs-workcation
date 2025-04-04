import { Model, DataTypes } from 'sequelize';


export default function SubjectsModel({ sequelize, Journal }: any) {

  class Subjects extends Model { }


  Subjects.init(
    {
      subject_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'Subjects',
      tableName: 'subjects',
      timestamps: true,
      underscored: true,
    }
  );

  // Associations
  Subjects.hasMany(Journal, { foreignKey: 'subject_id', as: 'subjects_marks' });

  return Subjects;
}