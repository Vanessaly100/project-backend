
"use strict";


const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Import all models 
const models = [
  require("./author"),
  require("./book"),
  require("./user.model"),
  require("./recommendation"),
  require("./transaction"),
  require("./borrow"),
  require("./cart"),
  require("./reservation"),
  require("./review"),
  require("./category"),
  require("./eventparticipant"),
  require("./libraryevent"),
  require("./notification"),
  require("./payment"),
  require("./share"),
]; 

models.forEach((modelImport) => {
  //  Check if model follows the class-based structure
  if (modelImport.prototype instanceof Sequelize.Model) {
    modelImport.init(modelImport.rawAttributes, { sequelize });
    db[modelImport.name] = modelImport;
  }
});

//  Setup associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
