const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Categories', [
      {
        category_id: uuidv4(), 
        name: "Fiction",
        description: "Novels and stories that contain events invented by the author.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Science Fiction",
        description: "Books based on futuristic concepts, advanced science, and technology.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Mystery",
        description: "Stories involving investigations, detectives, and uncovering secrets.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Fantasy",
        description: "Books that involve magic, mythical creatures, and supernatural elements.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Non-Fiction",
        description: "Books based on facts, real events, and real people.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Biography",
        description: "Life stories of real people, written by someone else or themselves.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Thriller",
        description: "Books full of suspense, excitement, and unexpected twists.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Romance",
        description: "Stories that focus on love and relationships.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "History",
        description: "Books that cover historical events and figures.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: uuidv4(),
        name: "Self-Help",
        description: "Books that provide guidance on personal growth and improvement.",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
