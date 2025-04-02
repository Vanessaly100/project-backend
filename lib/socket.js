let ioInstance; // Store WebSocket instance
const usersSockets = {}; // Store user ID to socket mapping

const initSocket = (server) => {
  const { Server } = require("socket.io");

  ioInstance = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Adjust if needed
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Store socket.id with user_id (you'll need to set this on login, etc.)
    socket.on("register", (user_id) => {
      usersSockets[user_id] = socket.id; // Store user-specific socket ID
      console.log(`User ${user_id} is now connected with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      // Clean up when user disconnects
      for (const user_id in usersSockets) {
        if (usersSockets[user_id] === socket.id) {
          delete usersSockets[user_id];
          console.log(`❌ User ${user_id} disconnected`);
        }
      }
    });
  });

  return ioInstance;
};

// Function to send real-time notifications to a specific user
const sendNotification = (user_id, message) => {
  if (ioInstance) {
    const userSocketId = usersSockets[user_id]; // Get the socket ID for the user
    if (userSocketId) {
      ioInstance.to(userSocketId).emit("notification", message); // Emit notification to the user
      console.log(`✅ Notification sent to user ${user_id}`);
    } else {
      console.log(`❌ User ${user_id} not connected`);
    }
  } else {
    console.error("❌ WebSocket instance is not initialized.");
  }
};

module.exports = { initSocket, sendNotification };
