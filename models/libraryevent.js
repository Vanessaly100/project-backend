'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  class LibraryEvent extends Model {
    static associate(models) {
      LibraryEvent.belongsToMany(models.User, {
        through: models.EventParticipant,
        foreignKey: "event_id",
      });
    }
  }

  LibraryEvent.init(
    {
      event_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, 
    {
      sequelize,
      modelName: "LibraryEvent",
      timestamps: false,
    }
  );
return LibraryEvent;
}
