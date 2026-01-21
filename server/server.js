const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const app = express();
const port = process.env.PORT;
if (!port) {
  console.error("PORT not set");
  process.exit(1);
}
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
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
app.get("/", (req, res) => {
  res.send("CollabEditor server is running!");
});
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
