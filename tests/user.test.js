const request = require("supertest");
// const app = require("../server");

describe("User Routes", () => {
  it("should fetch user details", async () => {
    const userId = "some-user-id";
    const res = await request(app).get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email");
  });

  it("should update user profile", async () => {
    const userId = "some-user-id";
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .send({ first_name: "Updated", last_name: "User" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User updated successfully");
  });
});
