'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");



  class Borrow extends Model {
    static associate(models) {
      Borrow.belongsTo(models.User, { foreignKey: "user_id" });
      Borrow.belongsTo(models.Book, { foreignKey: "book_id" });
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
      },
      borrow_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      return_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("borrowed", "returned", "overdue"),
        allowNull: false,
        defaultValue: "borrowed",
      },
    },
    {
      sequelize,
      modelName: "Borrow",
    }
  );

 module.exports = Borrow
