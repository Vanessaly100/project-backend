const cron = require("node-cron");
const { checkOverdueBooks } = require("./services/borrow.service");

cron.schedule("0 0 * * *", async () => {
  console.log("Checking for overdue books...");
  await checkOverdueBooks();
  console.log("Overdue check completed.");
});
