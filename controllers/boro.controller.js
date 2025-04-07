const { Borrow, Notification, Book, User } = require("../models");
// const { id } = require("../validators/book.validation");


exports.getBorrowRequests = async (req, res) => {
  try {
    const borrowRequests = await Borrow.findAll({
      where: { status: "borrowed" },
      include: [{ model: Book, as: "book", attributes: ["bookDetails"]}, { model: User, as: "user", attributes: ["userDetails"] }],
      
    });

    res.json(borrowRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Borrow a book
// Example of backend route for borrowing a book
// exports.borrowBook = async (req, res) => {
//   const { book_id } = req.params; // Get the bookId from the URL params
//   const userId = req.user.user_id; // Assuming the user is authenticated and their ID is in req.user

//   try {
//     // Logic to borrow the book
//     const book = await Book.findByPk(book_id); // Find the book by ID

//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     // Assuming you have a Borrow model to track borrow requests
//     const borrowRequest = await Borrow.create({
//       bookId: book.book_id,
//       userId: userId,
//       status: "Pending", // Pending approval
//     });

//     return res.status(200).json({ message: "Borrow request sent", borrowRequest });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };


exports.borrowBook = async (req, res) => {
  const { user_id, author_id } = req.body;
  const { bookId } = req.params; // Extract the bookId from the route params

  try {
    // Create a borrowing record (you can set the status as 'pending' initially)
    const borrowRequest = await Borrow.create({
      user_id: user_id,
      book_id: bookId,  // Use the bookId from the URL
      author_id: author_id,
      status: "pending",  // Pending status until admin approval
    });

    res.status(201).json({ message: "Book borrowed successfully", borrowRequest });
  } catch (error) {
    res.status(500).json({ message: "Error borrowing book", error: error.message });
  }
};

// Approve or Reject Borrow Request (Admin)
exports.approveBorrow = async (req, res) => {
  try {
    const { borrow_id } = req.params;
    const { status, returnDate } = req.body; // Status should be "approved" or "rejected"

    const borrow = await Borrow.findByPk(borrow_id);
    if (!borrow) return res.status(404).json({ message: "Borrow request not found" });

    borrow.status = status;
    if (status === "approved") borrow.returnDate = returnDate;
    await borrow.save();

    // Notify user
    await Notification.create({
      userId: borrow.user_id,
      message: `Your borrow request for book ID ${borrow.book_id} has been ${status}`,
    });

    res.json({ message: `Borrow request ${status}`, borrow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
