module.exports = {
  up: async (queryInterface) => {
    // Check if uuid-ossp extension is enabled
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Generate event data dynamically
    const events = [
      {
        event_id: queryInterface.sequelize.literal("uuid_generate_v4()"),
        title: "Book Launch: The Future of AI",
        description: "Join us for an exciting book launch exploring the future of artificial intelligence.",
        date: new Date("2025-04-15T18:00:00Z"),
        location: "City Library - Conference Hall",
        created_at: new Date(),
      },
      {
        event_id: queryInterface.sequelize.literal("uuid_generate_v4()"),
        title: "Author Meetup: Jane Doe",
        description: "A special session with bestselling author Jane Doe, discussing her latest novel.",
        date: new Date("2025-05-01T15:30:00Z"),
        location: "Downtown Library - Reading Room",
        created_at: new Date(),
      },
      {
        event_id: queryInterface.sequelize.literal("uuid_generate_v4()"),
        title: "Children's Storytelling Workshop",
        description: "An interactive storytelling workshop for young readers.",
        date: new Date("2025-06-10T10:00:00Z"),
        location: "Community Library - Kids Section",
        created_at: new Date(),
      },
      {
        event_id: queryInterface.sequelize.literal("uuid_generate_v4()"),
        title: "Sci-Fi Book Club: Discussing Dune",
        description: "Join fellow sci-fi enthusiasts for a deep dive into Frank Herbert’s 'Dune'.",
        date: new Date("2025-07-20T17:00:00Z"),
        location: "Westside Library - Book Club Room",
        created_at: new Date(),
      },
      {
        event_id: queryInterface.sequelize.literal("uuid_generate_v4()"),
        title: "Poetry Night: Open Mic",
        description: "An evening of poetry performances by local poets and literature lovers.",
        date: new Date("2025-08-05T19:00:00Z"),
        location: "Central Library - Rooftop Lounge",
        created_at: new Date(),
      },
    ];

    // Insert data dynamically
    await queryInterface.bulkInsert("LibraryEvents", events);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("LibraryEvents", null, {});
  },
};
