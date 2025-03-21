const request = require("supertest");
// const app = require("../server");

describe("Cart Routes", () => {
  it("should add a book to the cart", async () => {
    const res = await request(app)
      .post("/api/cart")
      .send({
        userId: "some-user-id",
        bookId: "some-book-id",
        quantity: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Book added to cart");
  });

  it("should fetch user's cart", async () => {
    const userId = "some-user-id";
    const res = await request(app).get(`/api/cart/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
