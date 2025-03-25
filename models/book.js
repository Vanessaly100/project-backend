const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Book extends Model {
  static associate(models) {
    Book.belongsTo(models.Author, { foreignKey: "author_id", as: "author" });
    Book.belongsTo(models.Category, { foreignKey: "category_id", as: "category" });
    Book.hasMany(models.Reservation, { foreignKey: "reservation_id" });
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
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    publication_year: {
      type: DataTypes.INTEGER,
    },
    available_copies: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Book",
  }
);

module.exports = Book;
