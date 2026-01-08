const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
require('dotenv').config();
const uri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
let documentContent = "";
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("load-document", documentContent);
  socket.on("send-changes", (content) => {
    documentContent = content;
    socket.broadcast.emit("receive-changes", content);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

