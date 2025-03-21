const request = require("supertest");
// const app = require("../server");

describe("Category Routes", () => {
  it("should fetch all categories", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should add a new category (Admin Only)", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", "Bearer some-admin-token") // Replace with valid token
      .send({ name: "New Category" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Category created successfully");
  });
});
