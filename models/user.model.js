const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = (sequelize, DataTypes) => {
class User extends Model {
  static associate(models) {
    User.hasMany(models.Reservation, { foreignKey: "user_id", as: "reservations" });
    User.hasMany(models.Borrow, { foreignKey: "user_id", as: "borrows" });
    User.hasMany(models.Review, { foreignKey: "user_id", as: "reviews" });
    User.hasMany(models.Recommendation, { foreignKey: "user_id", as: "recommendations" });
    User.hasMany(models.Notification, { foreignKey: "user_id", as: "notifications" });
    

  } 
} 

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    membership_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard",
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rewarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profile_picture_url: {
      type: DataTypes.STRING,
    },
    profilePicturePublicId: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    reading_preferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin"]],
      },
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

return User;
}
