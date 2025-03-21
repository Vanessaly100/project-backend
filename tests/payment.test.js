const request = require("supertest");
// const app = require("../server");

describe("Payment Routes", () => {
  it("should process a payment", async () => {
    const res = await request(app)
      .post("/api/payment")
      .send({
        userId: "some-user-id",
        amount: 100,
        cardDetails: "1234-5678-9012-3456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Payment successful");
  });

  it("should fetch payment history", async () => {
    const userId = "some-user-id";
    const res = await request(app).get(`/api/payment/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
