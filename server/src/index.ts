import http from "http";
import express from "express";
import socketio from "socket.io";

const app = express();
const server = new http.Server(app);
const io = new socketio.Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(5000, () => {
  console.log("listening on port 5000...");
});
