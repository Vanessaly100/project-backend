'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Borrow extends Model {
  static associate(models) {
    Borrow.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Borrow.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });
  }
}

Borrow.init(
  {
    borrow_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "user_id" },
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Books", key: "book_id" },
      onDelete: "CASCADE",
    },
    borrow_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    }, 
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Borrowed", "Returned", "Overdue"),
      defaultValue: "Borrowed",
    },
    // notified: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
  },
  {
    sequelize,
    modelName: "Borrow",
  }
);

module.exports = Borrow;
