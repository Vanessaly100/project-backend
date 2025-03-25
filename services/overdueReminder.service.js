const cron = require("node-cron");
const { Borrow, User, Book } = require("../models");
const { sendEmail } = require("./email.service"); 

const checkOverdueBooks = async () => {
  const today = new Date();
  const overdueBorrows = await Borrow.findAll({
    where: { dueDate: { [Op.lt]: today }, status: "Borrowed" },
    include: [{ model: User }, { model: Book }],
  });

  for (const borrow of overdueBorrows) {
    await sendEmail(
      borrow.User.email,
      "Overdue Book Reminder",
      `Your borrowed book "${borrow.Book.title}" is overdue! Please return it as soon as possible.`
    );
  }
};

// Schedule to run every day at midnight
cron.schedule("0 0 * * *", checkOverdueBooks);
