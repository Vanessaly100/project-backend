'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");


  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: "user_id" });
      Transaction.belongsTo(models.Payment, { foreignKey: "payment_id" });
    }
  }

  Transaction.init(
    {
      transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "user_id" },
      },
      payment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Payments", key: "payment_id" },
      },
      transaction_type: {
        type: DataTypes.ENUM("borrow", "purchase", "fine"),
        allowNull: false,
      },
      amount: {  // ✅ Added amount column
        type: DataTypes.FLOAT, 
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
      modelName: "Transaction",
    }
  );  

 module.exports = Transaction
