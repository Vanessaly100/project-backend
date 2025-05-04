const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Author = require("./author");
const Category = require("./category");
const Genre = require("./genre");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Association with Author
      Book.belongsTo(models.Author, { foreignKey: "author_id", as: "author" });

      // Association with Category
      Book.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      }); 

      // Association with Reservation
      Book.hasMany(models.Reservation, { foreignKey: "reservation_id" });

      // Association with Borrow
      Book.hasMany(models.Borrow, {
        foreignKey: "book_id",
        as: "borrows",
      });

      // Many-to-many relationship with Genre
      Book.belongsToMany(models.Genre, {
        through: "BookGenres",
        foreignKey: "book_id",
        otherKey: "genre_id",
        as:"genres",
      });
    }
  }
  Book.init(
    {
      book_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Author", key: "author_id" },
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Categories", key: "category_id" },
      },
      cover_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // genre: {
      //   type: DataTypes.ARRAY(DataTypes.STRING),
      //   allowNull: false,
      // },
      publication_year: {
        type: DataTypes.INTEGER,
      },
      totalCopies: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5, // Total number of copies for the book
      },

      available_copies: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5,
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );

  return Book;
};
