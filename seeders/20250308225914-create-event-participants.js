module.exports = {
  up: async (queryInterface) => {
    // Fetch all user IDs
    const users = await queryInterface.sequelize.query(
      'SELECT user_id FROM "Users";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Fetch all event IDs
    const events = await queryInterface.sequelize.query(
      'SELECT event_id FROM "LibraryEvents";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Ensure we have users and events to assign
    if (!users.length || !events.length) {
      console.warn("No users or events found, skipping seeder.");
      return;
    }

    // Helper function to get a random item from an array
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Status options
    const statusOptions = ["going", "interested", "not going"];

    // Create seed data
    const participants = Array.from({ length: 10 }).map(() => ({
      participant_id: queryInterface.sequelize.literal("uuid_generate_v4()"),
      user_id: getRandomItem(users).user_id,
      event_id: getRandomItem(events).event_id,
      status: getRandomItem(statusOptions),
      registered_at: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert into the database
    await queryInterface.bulkInsert("EventParticipants", participants);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("EventParticipants", null, {});
  },
};
