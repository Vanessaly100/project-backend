const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Author = require("./author");
const Categories = require("./category");

class Book extends Model {
  static associate(models) {
    Book.belongsTo(models.Author, { foreignKey: "author_id", as: "author" });
    Book.belongsTo(models.Category, { foreignKey: "category_id", as: "category" });
    Book.hasMany(models.Reservation, { foreignKey: "reservation_id" });
    Book.hasMany(models.Borrow, {
      foreignKey: "book_id",
      as: "borrows",
    });
    // Book.hasMany(models.Review, { foreignKey: "book_id", as: "reviews" });
    // Book.hasMany(models.Recommendation, { foreignKey: "book_id", as: "recommendations" });
    // Book.hasMany(models.Notification, { foreignKey: "book_id", as: "notifications" });
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
      references: { model: Author, key: "author_id" },
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Categories, key: "category_id" },
    },
    cover_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
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

module.exports = Book;
