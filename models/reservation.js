'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
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
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("Pending", "Fulfilled", "Cancelled"),
      defaultValue: "Pending",
    },
    
  }, 
  {
    sequelize, 
    modelName: "Reservation",
  }
);

return  Reservation;
}