import { Model, DataTypes } from 'sequelize';

export default function User_classesModel({ sequelize, Users }: any) {
  class User_classes extends Model { }

  User_classes.init(
    {
      user_class_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Classes',
          key: 'class_id', // Assuming Classes has a 'class_id' column as the primary key
        },
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Users,
          key: 'id', // Assuming Users has an 'id' column as the primary key
        },
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
      modelName: 'User_classes',
      tableName: 'user_classes',
      timestamps: true,
      underscored: true,
    }
  );
  return User_classes;
}
