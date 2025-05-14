"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookRating extends Model {
    static associate(models) {
      BookRating.belongsTo(models.User, { foreignKey: "user_id" });
      BookRating.belongsTo(models.Book, { foreignKey: "book_id" });
    }
  }

  BookRating.init(
    {
      rating_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BookRating",
    }
  );

  return BookRating;
};
