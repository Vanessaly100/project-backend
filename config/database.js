// const { Sequelize } = require("sequelize");
// const env = require("./env");

// const sequelize = new Sequelize(env.DATABASE_URL, {
//   dialect: "postgres",
//   logging: env.NODE_ENV === "development" ? console.log : false,
// });

// module.exports = sequelize;



const { Sequelize } = require("sequelize");
require("dotenv").config(); // ✅ Load environment variables

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Disable logging (optional)
});

module.exports = sequelize;
