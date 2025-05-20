
const { RecentActivity } = require("../models");

const logActivity = async ({
  user_id,
  type,
  book_id = null,
  rating = null,
}) => {
  await RecentActivity.create({ user_id, type, book_id, rating });
};

module.exports = logActivity;
