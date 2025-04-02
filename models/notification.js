'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Notification extends Model {
  static associate(models) {
    Notification.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Notification.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });
  }
}

Notification.init(
  {
    notification_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "user_id" },
      onDelete: "CASCADE",
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "Books", key: "book_id" },
      onDelete: "SET NULL",
    },
    type: {
      type: DataTypes.ENUM("Review", "Borrow", "Return", "Overdue","Reminder", "Update", "Reservation","General"),
      defaultValue: "General",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     is_read: {
      type: DataTypes.ENUM("Unread", "Read"),
      defaultValue: "Unread",
    },
    // created_at: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
  },
  {
    sequelize,
    modelName: "Notification",
  }
);

module.exports = Notification;
