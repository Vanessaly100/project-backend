'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");



  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
Reservation.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });

    }
  }

  Reservation.init(
    {
      reservation_id: {
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
      status: {
        type: DataTypes.ENUM("pending", "fulfilled", "canceled"),
        defaultValue: "pending",
      },
      reservation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Reservation",
    }
  ); 

  module.exports = Reservation
