'use strict';
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcryptjs');
const { Sequelize } = require("sequelize"); 
module.exports = {
  up: async (queryInterface) => {
    const users = [
      {
        user_id: uuidv4(),
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@examples.com",
        password_hash: await bcrypt.hash("password123", 10),
        membership_type: "premium",
        points: 120,
        profile_picture_url:
          "https://cdn.pixabay.com/photo/2014/04/03/10/41/person-311134_1280.png",
        location: "New York, USA",
        reading_preferences: ["Science Fiction", "Fantasy"],
        rewarded: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: uuidv4(),
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smiths@example.com",
        password_hash: await bcrypt.hash("securePass456", 10),
        membership_type: "standard",
        points: 80,
        rewarded: false,
        profile_picture_url:
          "https://cdn.pixabay.com/photo/2014/04/03/10/41/person-311134_1280.png",
        location: "London, UK",
        reading_preferences: ["Mystery", "Thriller"],

        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: uuidv4(),
        first_name: "Michael",
        last_name: "Brown",
        email: "michael.browns@example.com",
        password_hash: await bcrypt.hash("mikeSecure789", 10),
        membership_type: "basic",
        points: 50,
        rewarded: false,
        profile_picture_url: "https://example.com/michael.jpg",
        location: "Toronto, Canada",
        reading_preferences: ["Non-Fiction", "Biography"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Users", users);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
