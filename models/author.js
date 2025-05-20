const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      Author.hasMany(models.Book, { foreignKey: "author_id", as: "books" });
    }
  }

  Author.init(
    {
      author_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      social_media: { type: DataTypes.STRING },
      contact: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, unique: true },
    },
    {
      sequelize,
      modelName: "Author",
    }
  );
  return Author;
};
