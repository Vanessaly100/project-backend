const { Share } = require("../models");

// Log a new book share
const logShare = async (userId, bookId, platform) => {
  const newShare = await Share.create({ user_id: userId, book_id: bookId, platform });
  return newShare;
};

// Track interactions (likes, comments, shares)
const trackInteraction = async (shareId) => {
  const share = await Share.findByPk(shareId);
  if (!share) throw new Error("Share not found");

  share.interaction_count += 1;
  await share.save();
  return share.interaction_count;
};

module.exports = { logShare, trackInteraction };
