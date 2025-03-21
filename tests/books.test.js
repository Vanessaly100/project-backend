const request = require("supertest");
// const app = require("../server");

describe("Book Routes", () => {
  it("should fetch all books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should fetch a single book by ID", async () => {
    const bookId = "some-book-id"; // Replace with an actual book ID
    const res = await request(app).get(`/api/books/${bookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title");
  });
});
