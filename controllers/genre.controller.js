const genreServices = require("../services/genre.service")
const asyncHandler = require("express-async-handler");
const {
  NotFoundException,
  InternalServerErrorException,
} = require("../lib/errors.definitions");


exports.getAllGenre = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "ASC",
    filter = "",
  } = req.query;
  const { totalGenres, genres } = await genreServices.getAllGenre({
    page,
    limit,
    sort,
    order,
    filter,
  });

  if (!genres) {
    throw new NotFoundException("Author not found");
  }

  res.json({ totalGenres, genres });
});
















