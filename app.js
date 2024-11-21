const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const socketIo = require("socket.io");
const errorHandler = require("./middlewares/errorHandler");

// Load environment variables
dotenv.config();

// Initialize Express app and create HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = socketIo(server, {
  cors: {
   origin: [
      "https://site33715-45ghcw.scloudsite101.com",
      "http://localhost:5173",
    ], // Ensure this matches your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});
module.exports.io = io;

// Database connection
connectDB();

// Middleware setup
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://site33715-45ghcw.scloudsite101.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


// Socket.IO real-time notification logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined room user-${userId}`);
  });

  socket.on("likeNotification", ({ senderId, receiverId }) => {
    io.to(`user-${receiverId}`).emit("notification", {
      type: "like",
      message: `User ${senderId} liked your profile!`,
    });
    console.log(`Sent like notification from ${senderId} to ${receiverId}`);
  });

  socket.on("matchNotification", ({ userId1, userId2 }) => {
    io.to(`user-${userId1}`).emit("notification", {
      type: "like",
      message: `User ${currentUserId} liked your profile!`,
    });
    io.to(`user-${userId2}`).emit("notification", {
      type: "match",
      message: "You have a new match!",
    });
    console.log(`Sent match notifications to ${userId1} and ${userId2}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Route imports
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
