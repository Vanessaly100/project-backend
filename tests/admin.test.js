const request = require("supertest");
// const app = require("../server");

describe("Admin Routes", () => {
  it("should fetch all users (Admin Only)", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", "Bearer some-admin-token"); // Replace with a valid token

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should delete a user (Admin Only)", async () => {
    const userId = "some-user-id";
    const res = await request(app)
      .delete(`/api/admin/users/${userId}`)
      .set("Authorization", "Bearer some-admin-token"); // Replace with a valid token

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");
  });
});
