const request = require("supertest");
// const app = require("../server");

describe("Borrow Routes", () => {
  it("should borrow a book", async () => {
    const res = await request(app)
      .post("/api/borrow")
      .send({
        userId: "some-user-id",
        bookId: "some-book-id",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Book borrowed successfully");
  });

  it("should fetch borrowed books", async () => {
    const userId = "some-user-id";
    const res = await request(app).get(`/api/borrow/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
