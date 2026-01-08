const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

// Use only the PORT from environment (required by cloud platforms)
const port = process.env.PORT;
if (!port) {
  console.error("Error: PORT environment variable is not set.");
  process.exit(1);
}

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // adjust if frontend is hosted elsewhere
    methods: ["GET", "POST"],
  },
});

// In-memory document content
let documentContent = "";

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send current document content to the newly connected user
  socket.emit("load-document", documentContent);

  // Listen for changes from this user
  socket.on("send-changes", (content) => {
    documentContent = content;
    socket.broadcast.emit("receive-changes", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
