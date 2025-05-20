
module.exports = (sequelize, DataTypes) => {
  const RecentActivity = sequelize.define("RecentActivity", {
    activity_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: DataTypes.UUID,
    type: DataTypes.STRING,
    book_id: DataTypes.UUID,
    rating: DataTypes.INTEGER,
  });

  RecentActivity.associate = (models) => {
    RecentActivity.belongsTo(models.User, { foreignKey: "user_id" });
    RecentActivity.belongsTo(models.Book, { foreignKey: "book_id" });
  };

  return RecentActivity;
};
