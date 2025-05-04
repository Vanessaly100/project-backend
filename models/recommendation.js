'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    static associate(models) {
      Recommendation.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Recommendation.init(
    {
      recommendation_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "user_id" },
      },
      recommended_books: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
      },
      algorithm_used: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Recommendation",
    }
  ); 

return Recommendation
}
