const cron = require("node-cron");
const { checkOverdueBorrows} = require("./services/notification.service");
const { checkUpcomingDueDates } = require("./services/notification.service");
const NotificationService = require("./services/notification.service"); 
const { Op } = require("sequelize");
const { Borrow, User, Book } = require("./models");

cron.schedule("0 0 * * *", async () => {
  console.log("Checking for overdue books...");
  await checkOverdueBorrows();
  console.log("Overdue check completed.");
});



cron.schedule("0 8 * * *", async () => {
  console.log("Cron job running: checking upcoming due dates");
  try {
    await checkUpcomingDueDates();
    console.log("Notification check completed Cron job Running");
  } catch (err) {
    console.error("Cron job error:", err);
  }
});


// Cron job to run every hour to check for returned books and send notifications
cron.schedule("0 * * * *", async () => {
  try {
    // Find all borrow records where return_date is set
    const returnedBooks = await Borrow.findAll({
      where: { return_date: { [Op.ne]: null } },
      include: [
        { model: User, as: "user" },
        { model: Book, as: "book" },
      ],
    });
    if (!returnedBooks.length) {
      console.log("No returned books to notify.");
      return;
    }
    for (let borrowRecord of returnedBooks) {
      await NotificationService.notifyBookReturned(borrowRecord);
      console.log(`Notified about returned book: ${borrowRecord.Book.title}`);
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
console.log("Cron job for book returned notifications is running...");