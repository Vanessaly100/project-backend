
const {
  Book,
  User,
  Reservation,
  Borrow,
  Category,
  Author,
} = require("../models");
const { Op, Sequelize } = require("sequelize");

exports.getDashboardStats = async () => {
  const [
    totalBooks,
    totalUsers,
    totalBorrows,
    totalReservations,
    mostBorrowedBooks,
    lowStockBooks,
    recentActivity,
  ] = await Promise.all([
    Book.count(),
    User.count(),
    Reservation.count(),
    Borrow.count(),

    Book.findAll({
      order: [["borrowCount", "DESC"]],
      limit: 5,
      attributes: ["title", "borrowCount"],
    }),

   
    Book.findAll({
      where: { available_copies: { [Op.lte]: 3 } },
      attributes: ["title", "available_copies"],
    }),

  
    Borrow.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
      include: ["user", "book"],
    }),
  ]);

  return {
    totalBooks,
    totalUsers,
    totalBorrows,
    totalReservations,
    mostBorrowedBooks,
    lowStockBooks,
    recentActivity,
  };
};


exports.getOverview = async () => {
  const totalBooks = await Book.count();
  const totalUsers = await User.count();
  const totalBorrows = await Borrow.count();
  const totalReservations = await Reservation.count();

  return { totalBooks, totalBorrows, totalUsers, totalReservations };
};

exports.getPopularBooks = async () => {
  const books = await Book.findAll({
    order: [["borrowCount", "DESC"]],
    limit: 5,
    attributes: ["book_id", "title", "borrowCount","cover_url"],
  });
  return books;
};

exports.getLowStockBooks = async () => {
  const books = await Book.findAll({
    where: { available_copies: { [Op.lte]: 3 } },
    attributes: ["book_id", "title", "available_copies"],
  });
  return books;
};


exports.getRecentActivity = async ({ page = 1, limit = 10, startDate, endDate, categoryId }) => {
  const offset = (page - 1) * limit;
  const whereClause = {};

  // Date range filter
  if (startDate && endDate) {
    whereClause.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  }

  const include = [
    { model: User, as: "user", attributes: ["user_id", "first_name", "email"] },
    {
      model: Book,
      as: "book",
      attributes: ["book_id", "title", "category_id", "cover_url", "avgRating"],
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
      include: [
        {
          model: Author,
          as: "author",
          attributes: ["name"],
        },
      ],
    },
  ];

  // Filter by category ID (must be applied to associated Book model)
  if (categoryId) {
    include[1].where = { category_id: categoryId };
  }

  const { count, rows } = await Borrow.findAndCountAll({
    where: whereClause,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    activities: rows,
  };
};



exports.getAllRecentActivities = async ({
  page = 1,
  limit = 10,
  startDate,
  endDate,
  type,
}) => {
  const offset = (page - 1) * limit;
  const whereDate = {};

  if (startDate && endDate) {
    whereDate.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  }

  const activities = [];

  const fetchAndFormat = async (Model, activityType, include, formatter) => {
    if (!type || type === activityType) {
      const { rows, count } = await Model.findAndCountAll({
        where: whereDate,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include,
      });

      const formatted = rows.map(formatter);
      activities.push(...formatted);
      return count;
    }
    return 0;
  };

  const counts = {
    borrow: await fetchAndFormat(Borrow, "Borrow", [User, Book], (borrow) => ({
      type: "Borrow",
      user: borrow.User?.first_name,
      book: borrow.Book?.title,
      createdAt: borrow.createdAt,
    })),

    reservation: await fetchAndFormat(
      Reservation,
      "Reservation",
      [User, Book],
      (reservation) => ({
        type: "Reservation",
        user: reservation.User?.first_name,
        book: reservation.Book?.title,
        createdAt: reservation.createdAt,
      })
    ),

    rating: await fetchAndFormat(
      BookRating,
      "Rating",
      [User, Book],
      (rating) => ({
        type: "Rating",
        user: rating.User?.first_name,
        book: rating.Book?.title,
        rating: rating.rating,
        createdAt: rating.createdAt,
      })
    ),

    newuser: await fetchAndFormat(User, "NewUser", [], (user) => ({
      type: "NewUser",
      user: user.first_name,
      createdAt: user.createdAt,
    })),
  };

  // Sort all combined activities by date
  activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    activities,
    totalPages: Math.ceil(
      Object.values(counts).reduce((a, b) => a + b, 0) / limit
    ),
  };
};


exports.getChartData = async () => {
  const borrowStats = await Borrow.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("Borrow.createdAt")), "borrowDate"],
      [Sequelize.fn("COUNT", Sequelize.col("Borrow.borrow_id")), "borrowCount"],
    ],
    group: [Sequelize.fn("DATE", Sequelize.col("Borrow.createdAt"))],
    order: [[Sequelize.fn("DATE", Sequelize.col("Borrow.createdAt")), "ASC"]],
  });

  return borrowStats.map((stat) => ({
    date: stat.dataValues.borrowDate,
    borrowCount: stat.dataValues.borrowCount,
  }));
};