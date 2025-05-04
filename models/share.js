'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");


module.exports = (sequelize, DataTypes) => {
  class Share extends Model {
    static associate(models) {
      Share.belongsTo(models.User, { foreignKey: "user_id" });
      Share.belongsTo(models.Book, { foreignKey: "book_id" });
    }
  }

  Share.init(
    {
      share_id: {
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
      platform: {
        type: DataTypes.ENUM("Facebook", "Twitter", "Instagram", "LinkedIn", "WhatsApp"),
        allowNull: false,
      },
      shared_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      interaction_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Share",
    }
  );

return Share
}
