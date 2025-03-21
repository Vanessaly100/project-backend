'use strict';
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("EventParticipants", {
      participant_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users", key: "user_id" },
        onDelete: "CASCADE",
      },
      event_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "LibraryEvents", key: "event_id" },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("going", "interested", "not going"),
        allowNull: false,
        defaultValue: "going",
      },
      registered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("EventParticipants");
  },
};
