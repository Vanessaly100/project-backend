'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");


  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Payment.init(
    {
      payment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "user_id" },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );

 module.exports = Payment