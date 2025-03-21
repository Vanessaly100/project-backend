const cron = require("node-cron");
const reservationService = require("./services/reservation.service");

// Run every 5 minutes to check for available books and notify users
cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Checking for available books...");

  const books = await require("./models").Book.findAll();
  for (const book of books) {
    await reservationService.notifyUsers(book.book_id);
  }
});

console.log("✅ Book reservation cron job started.");
