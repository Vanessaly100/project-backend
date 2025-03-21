'use strict';

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("Authors", [
      {
        author_id: uuidv4(),
        name: "J.K. Rowling",
        bio: "British author, best known for the Harry Potter series.",
        social_media: "@jk_rowling",
        contact: "+44 20 7946 0958",
        email: "jkrowlings@official.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        author_id: uuidv4(),
        name: "George R.R. Martin",
        bio: "American novelist known for A Song of Ice and Fire, the basis for Game of Thrones.",
        social_media: "@GRRMspeaking",
        contact: "+1 505 555 1234",
        email: "george.martin@westeross.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        author_id: uuidv4(),
        name: "Stephen King",
        bio: "American author of horror, supernatural fiction, suspense, and fantasy novels.",
        social_media: "@StephenKing",
        contact: "+1 207 555 5678",
        email: "stephen.king@castles.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        author_id: uuidv4(),
        name: "Agatha Christie",
        bio: "British writer known for her detective novels featuring Hercule Poirot and Miss Marple.",
        social_media: "@agathaofficial",
        contact: "+44 20 7946 1122",
        email: "agatha.christie@mysterys.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        author_id: uuidv4(),
        name: "Isaac Asimov",
        bio: "Russian-born American writer and professor known for his works on science fiction and popular science.",
        social_media: "@IsaacAsimov",
        contact: "+1 212 555 9987",
        email: "isaac.asimov@foundations.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        author_id: uuidv4(),
        name: "Jane Austen",
        bio: "English novelist known for romantic fiction, including Pride and Prejudice.",
        social_media: "@JaneAusten",
        contact: "+44 123 456 7890",
        email: "jane.austen@regencys.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        author_id: uuidv4(),
        name: "Dan Brown",
        bio: "American author best known for thrillers like The Da Vinci Code.",
        social_media: "@AuthorDanBrown",
        contact: "+1 617 555 7890",
        email: "dan.brown@robertlangdons.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Authors", null, {});
  },
};
