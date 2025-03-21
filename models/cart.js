'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");


  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: "user_id" });
      Cart.belongsTo(models.Book, { foreignKey: "book_id" });
    }
  }

  Cart.init(
    {
      cart_id: {
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
       quantity: {
      type: DataTypes.INTEGER, // Ensure the quantity column is defined
      allowNull: false,
      defaultValue: 1, // Default to 1 if not specified
    },
      added_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );

 module.exports = Cart
