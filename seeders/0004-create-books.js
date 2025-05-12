'use strict';
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all authors from the Authors table
    const authors = await queryInterface.sequelize.query(
      `SELECT author_id, name FROM "Authors";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Fetch all categories from the Categories table
    const categories = await queryInterface.sequelize.query(
      `SELECT category_id, name FROM "Categories";`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Create a map of author names to their author_ids
    const authorMap = {};
    authors.forEach((author) => {
      authorMap[author.name] = author.author_id;
    });

    // Create a map of category names to their category_ids
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.name] = category.category_id;
    });

    console.log("Seeding books with IDs:");
    // Define the books with the correct author_id from the map
    const books = [
      // Books by J.K. Rowling
      {
        cover_url:
          "https://pixabay.com/illustrations/book-cover-book-3d-ebook-1024644/",
        title: "Harry Potter and the Sorcerer's Stone",
        genre: ["Fantasy"],
        author: "J.K. Rowling",
        publication_year: 1997,
        category: "Fantasy",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/71PJFev2KuL._AC_UL127_SR127,127_.jpg",
        title: "Harry Potter and the Chamber of Secrets",
        genre: ["Fantasy"],
        author: "J.K. Rowling",
        publication_year: 1998,
        category: "Romance",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81qFXvsZ2sL._AC_UL127_SR127,127_.jpg",
        title: "Harry Potter and the Prisoner of Azkaban",
        genre: ["Fantasy"],
        author: "J.K. Rowling",
        publication_year: 1999,
        category: "Fantasy",
      },

      // Books by George R.R. Martin
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81ANaVZk5LL._AC_UL127_SR127,127_.jpg",
        title: "A Game of Thrones",
        genre: ["Fantasy"],
        author: "George R.R. Martin",
        publication_year: 1996,
        category: "Mystery",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/71Q6zkV1cYL._AC_UL381_SR381,381_.jpg",
        title: "A Clash of Kings",
        genre: ["Fantasy"],
        author: "George R.R. Martin",
        publication_year: 1998,
        category: "Mystery",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/91-E86oM2IL._AC_UL381_SR381,381_.jpg",
        title: "A Storm of Swords",
        genre: ["Fantasy"],
        author: "George R.R. Martin",
        publication_year: 2000,
        category: "Fantasy",
      },

      // Books by Stephen King
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81AHTyq2wVL._AC_UL254_SR254,254_.jpg",
        title: "The Shining",
        genre: ["Romance"],
        author: "Stephen King",
        publication_year: 1977,
        category: "Romance",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81q6ckUXE5L._AC_UL381_SR381,381_.jpg",
        title: "It",
        genre: ["Non-Fiction"],
        author: "Stephen King",
        publication_year: 1986,
        category: "Fantasy",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/9101MLPcFTL._AC_UL381_SR381,381_.jpg",
        title: "Misery",
        genre: ["Thriller"],
        author: "Stephen King",
        publication_year: 1987,
        category: "Mystery",
      },

      // Books by Agatha Christie
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81MqxNVfZuL._AC_UL381_SR381,381_.jpg",
        title: "Murder on the Orient Express",
        genre: ["Mystery"],
        author: "Agatha Christie",
        publication_year: 1934,
        category: "Fantasy",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81OkWjcf4WL._AC_UL381_SR381,381_.jpg",
        title: "And Then There Were None",
        genre: ["Mystery"],
        author: "Agatha Christie",
        publication_year: 1939,
        category: "Romance",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81Rz9l29NiL._AC_UL127_SR127,127_.jpg",
        title: "The Murder of Roger Ackroyd",
        genre: ["Mystery"],
        author: "Agatha Christie",
        publication_year: 1926,
        category: "Romance",
      },

      // Books by Isaac Asimov
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/913C+MR3S5L._AC_UL254_SR254,254_.jpg",
        title: "Foundation",
        genre: ["Science", "Fiction"],
        author: "Isaac Asimov",
        publication_year: 1951,
        category: "History",
      },
      {
        cover_url:
          "https://pixabay.com/illustrations/book-cover-book-3d-ebook-1024644/",
        title: "I, Robot",
        genre: ["Science", "Fiction"],
        author: "Isaac Asimov",
        publication_year: 1950,
        category: "Fantasy",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81mpSoJzv4L._AC_UL381_SR381,381_.jpg",
        title: "The Caves of Steel",
        genre: ["Science", "Fiction"],
        author: "Isaac Asimov",
        publication_year: 1954,
        category: "History",
      },

      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/611X8GI7hpL._AC_UL254_SR254,254_.jpg",
        title: "Pride and Prejudice",
        genre: ["Romance"],
        author: "Jane Austen",
        publication_year: 1813,
        category: "History",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/71dn+hvNIOL._AC_UL254_SR254,254_.jpg",
        title: "Sense and Sensibility",
        genre: ["Romance"],
        author: "Jane Austen",
        publication_year: 1811,
        category: "Mystery",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/71SLeCwMlWL._AC_UL381_SR381,381_.jpg",
        title: "Emma",
        genre: ["Romance"],
        author: "Jane Austen",
        publication_year: 1815,
        category: "Non-Fiction",
      },

      // Books by Dan Brown
      {
        cover_url:
          "https://pixabay.com/illustrations/blogs-marketing-traders-2646804/",
        title: "The Da Vinci Code",
        genre: ["Thriller"],
        author: "Dan Brown",
        publication_year: 2003,
        category: "Non-Fiction",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81Vg20D3CML._AC_UL127_SR127,127_.jpg",
        title: "Angels & Demons",
        genre: ["Thriller"],
        author: "Dan Brown",
        publication_year: 2000,
        category: "Fantasy",
      },
      {
        cover_url:
          "https://images-na.ssl-images-amazon.com/images/I/81Ej0QqRpcL._AC_UL381_SR381,381_.jpg",
        title: "Inferno",
        genre: ["Thriller"],
        author: "Dan Brown",
        publication_year: 2013,
        category: "Fantasy",
      },
    ];

    // Map each book to insert the correct author_id and category_id
    const booksData = books.map((book) => {
      if (!authorMap[book.author]) {
        throw new Error(
          `Author '${book.author}' not found in the Authors table.`
        );
      }
      if (!categoryMap[book.category]) {
        throw new Error(
          `Category '${book.category}' not found in the Categories table.`
        );
      }
      return {
        book_id: uuidv4(),
        cover_url: book.cover_url,
        title: book.title,
        // genre: book.genre,
        author_id: authorMap[book.author],
        category_id: categoryMap[book.category],
        publication_year: book.publication_year,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    // Insert books into the Books table
    await queryInterface.bulkInsert("Books", booksData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Books", null, {});
  },
};



