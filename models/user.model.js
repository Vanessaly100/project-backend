const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class User extends Model {
  static associate(models) {
    User.hasMany(models.Transaction, { foreignKey: "user_id", as: "transactions" });
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
    profile_picture_url: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    reading_preferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    wishlist: {
      type: DataTypes.ARRAY(DataTypes.UUID),
    },
    borrow_history: {
      type: DataTypes.ARRAY(DataTypes.UUID),
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

module.exports = User;
