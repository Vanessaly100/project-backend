const request = require("supertest");
// const app = require("../server");

describe("Recommendation Routes", () => {
  it("should fetch recommended books for a user", async () => {
    const userId = "some-user-id";
    const res = await request(app).get(`/api/recommendations/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
