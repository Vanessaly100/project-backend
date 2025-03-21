const request = require("supertest");
// const app = require("../server");

describe("Reservation Routes", () => {
  it("should reserve a book", async () => {
    const res = await request(app)
      .post("/api/reservations")
      .send({
        userId: "some-user-id",
        bookId: "some-book-id",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Book reserved successfully");
  });

  it("should fetch reservations for a user", async () => {
    const userId = "some-user-id";
    const res = await request(app).get(`/api/reservations/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
