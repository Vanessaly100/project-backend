const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Associations with other models
      Book.belongsTo(models.Author, { foreignKey: "author_id", as: "author" });
      Book.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
      Book.hasMany(models.Borrow, { foreignKey: "book_id", as: "borrows" });
      Book.hasMany(models.Review, { foreignKey: "review_id", as: "review" });

      // Many-to-many relationship with Genre
      Book.belongsToMany(models.Genre, {
        through: "BookGenres",
        foreignKey: "book_id",
        otherKey: "genre_id",
        as: "genres",
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
        references: { model: "Authors", key: "author_id" },
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
      publication_year: {
        type: DataTypes.INTEGER,
      },
      totalCopies: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5,
      },
      available_copies: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5,
      },
      borrowCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );

  return Book;
};
