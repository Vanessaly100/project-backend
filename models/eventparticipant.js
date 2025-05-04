'use strict';
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
  class EventParticipant extends Model {
    static associate(models) {
      EventParticipant.belongsTo(models.User, { foreignKey: "user_id" });
      EventParticipant.belongsTo(models.LibraryEvent, { foreignKey: "event_id" });
    }
  }

  EventParticipant.init(
    {
      participant_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "user_id" },
        onDelete: "CASCADE",
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "LibraryEvents", key: "event_id" },
        onDelete: "CASCADE",
      },
     status: {
        type: DataTypes.ENUM("going", "interested", "not going"),
        allowNull: false,
        defaultValue: "going",
      },
      registered_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "EventParticipant",
    }
  );

 return EventParticipant;
}
