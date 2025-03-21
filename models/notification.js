'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");


  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: "user_id" });
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
      },
       book_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Books", key: "book_id" },
        onDelete: "CASCADE",
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("Reminder", "Promotion", "System", "Custom"),
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Notification",
      timestamps: false,
    }
  );

  module.exports = Notification
