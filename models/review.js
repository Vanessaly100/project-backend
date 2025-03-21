'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Review extends Model {
  static associate(models) {
    // A Review belongs to a User and a Book
    Review.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Review.belongsTo(models.Book, { foreignKey: "book_id", as: "book" });
  }
}

Review.init(
  {
    review_id: {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Review",
  }
);

module.exports = Review;
