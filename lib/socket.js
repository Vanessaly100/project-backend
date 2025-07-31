let ioInstance; 
const usersSockets = {}; 
const activeSockets = new Set(); 

const initSocket = (server) => {
  const { Server } = require("socket.io");

  ioInstance = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    if (!activeSockets.has(socket.id)) {
      activeSockets.add(socket.id);
      console.log(`[SOCKET] User connected: ${socket.id}`);
    }

socket.on("register", ({ user_id, role }) => {
  usersSockets[user_id] = socket.id;
  console.log(
    `[SOCKET] Registered user ${user_id} (${role}) to socket ${socket.id}`
  );
});


    // Clean up on disconnect
    socket.on("disconnect", () => {
      activeSockets.delete(socket.id);

      for (const user_id in usersSockets) {
        if (usersSockets[user_id] === socket.id) {
          delete usersSockets[user_id];
          console.log(`[SOCKET] User ${user_id} disconnected`);
        }
      }

      console.log(`[SOCKET] Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};


const sendNotification = (target, message) => {
  if (!ioInstance) return;

  // Send to all admins
  if (target === "admin") {
    for (const user_id in usersSockets) {
      if (usersSockets[user_id].role === "admin") {
        const socketId = usersSockets[user_id].socketId;
        ioInstance.to(socketId).emit("notification", message);
      }
    }
    return;
  }

  // Send to individual user
 const socketId = usersSockets[target];
 if (socketId) {
   ioInstance.to(socketId).emit("newNotification", message);
   console.log(`[SOCKET] Notification sent to ${target} (${socketId})`);
 } else {
   console.warn(`[SOCKET] No socket found for user_id: ${target}`);
 }

};

module.exports = { initSocket, sendNotification };




