import { Model, DataTypes } from 'sequelize';

export default function UsersModel({ sequelize, Journal }: any) {
  const statusValues = ['admin', 'teacher', 'student'];
  const roleValues = ['active', 'banned', 'graduated', 'fired'];

  class Users extends Model { }

  Users.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true, // Validates email format
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true, // Ensures password is alphanumeric
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: statusValues,
        allowNull: false,
        validate: {
          isIn: {
            args: [statusValues],
            msg: `No status. Valid statuses: 'active', 'banned', 'graduated', 'fired'`,
          },
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: roleValues,
        allowNull: false,
        validate: {
          isIn: {
            args: [roleValues],
            msg: `No role. Valid roles: 'admin', 'teacher', 'student'`,
          },
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
      modelName: 'Users',
      tableName: 'users',
      timestamps: true,
      underscored: true,
    }
  );

  // Associations
  // Users.hasMany(Classes, { foreignKey: 'teacher_id', as: 'classes' }); // Assuming `teacher_id` exists in Classes table
  // Users.belongsToMany(Classes, { through: User_classes, foreignKey: 'student_id', as: 'student_classes' });
  Users.hasMany(Journal, { foreignKey: 'teacher_id', as: 'teachers_marks' });
  Users.hasMany(Journal, { foreignKey: 'student_id', as: 'students_marks' });
  return Users;
}
