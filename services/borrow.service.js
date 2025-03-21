const { Borrow, User, Book } = require("../models");

//  Fetch all borrowed books with user & book details
exports.getAllBorrows = async () => {
  return await Borrow.findAll({
    include: [
      { model: User, attributes: ["first_name", "last_name", "email"] },
      { model: Book, attributes: ["title"] }
    ],
    order: [["borrow_date", "DESC"]],
  });
};