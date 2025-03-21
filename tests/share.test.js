const request = require("supertest");
// const app = require("../server");

describe("Share Routes", () => {
  it("should share a book link", async () => {
    const res = await request(app)
      .post("/api/shares")
      .send({
        userId: "some-user-id",
        bookId: "some-book-id",
        platform: "Twitter",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Book shared successfully");
  });
});
