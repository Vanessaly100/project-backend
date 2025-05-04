"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      // Many-to-many relationship with Book
      Genre.belongsToMany(models.Book, {
        through: "BookGenres",
        foreignKey: "genre_id",
        otherKey: "book_id",
      });
    }
  }

  // Initialize the Genre model
  Genre.init(
    {
      genre_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Genre",
    }
  );

  return Genre;
};
