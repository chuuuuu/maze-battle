import http from "http";
import express from "express";
import socketio from "socket.io";
import { v4 as uuid } from "uuid";
import { MazeGenerator } from "./mazeGenerator";

const mazeGenerator = new MazeGenerator(10, 10);

const app = express();
const server = new http.Server(app);
const io = new socketio.Server(server);

// give user the room_id
app.get("/", (req, res) => {
  const id = uuid();
  res.sendFile(__dirname + "/index.html");
  res.json(id);
});

// give user the maze json
app.get("/:room", (req, res) => {
  const maze = mazeGenerator.createMaze();
  res.json(maze);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("echo", (msg) => {
    console.log("message: " + msg);
    socket.emit("echo", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on port 5000...");
});
