const request = require("supertest");
// const app = require("../server"); // Import your Express app

describe("Authentication Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        password: "password123",
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login a user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "johndoe@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
