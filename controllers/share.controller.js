const shareService = require("../services/share.service");

// Share a book
exports.shareBook = async (req, res) => {
  try {
    const { userId, bookId, platform } = req.body;
    const shareRecord = await shareService.logShare(userId, bookId, platform);

    res.status(201).json({ message: "Book shared successfully", share: shareRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Track interactions (likes, comments, shares)
exports.trackInteraction = async (req, res) => {
  try {
    const { shareId } = req.body;
    const newCount = await shareService.trackInteraction(shareId);

    res.json({ message: "Interaction recorded", interactionCount: newCount });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
