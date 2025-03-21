const request = require("supertest");
// const app = require("../server");

describe("Notification Routes", () => {
  it("should fetch notifications for a user", async () => {
    const userId = "some-user-id";
    const res = await request(app).get(`/api/notifications/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should mark a notification as read", async () => {
    const notificationId = "some-notification-id";
    const res = await request(app).put(`/api/notifications/${notificationId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Notification marked as read");
  });
});
