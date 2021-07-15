import http from "http";
import express from "express";
import socketio from "socket.io";
// import { v4 as uuid } from "uuid";
import { MazeGenerator } from "./mazeGenerator";
import cors from "cors";
import session from "express-session";
import { COOKIE_NAME, PROD } from "./config";

const mazeGenerator = new MazeGenerator(10, 10);

const app = express();
const server = new http.Server(app);
const io = new socketio.Server(server);

// cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// session setup
app.use(
  session({
    name: COOKIE_NAME,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: PROD, // cookie only works in https
    },
    saveUninitialized: false,
    secret: "im secret",
    resave: false,
  })
);

declare module "express-session" {
  export interface SessionData {
    user: number;
  }
}

// give user the room_id
app.get("/", (req, res) => {
  console.log(req.session.user);
  if (req.session.user == undefined) {
    res.json("you are not login");
    return;
  }

  res.sendFile(__dirname + "/index.html");
});

// login
app.get("/login", (req, res) => {
  console.log("login");
  req.session.user = 0;
  res.send(true);
});

// logout
app.get("/logout", async (req, res) => {
  console.log("logout");
  res.clearCookie(COOKIE_NAME);

  const is_logout = await new Promise((resolve) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        resolve(false);
        return;
      }

      resolve(true);
    });
  });

  res.send(is_logout);
});

// give user the maze json
app.get("/maze", (_, res) => {
  const maze = mazeGenerator.createMaze();
  res.json(maze);
});

app.get("/maze_with_session", (req, res) => {
  if (req.session.user == undefined) {
    res.json("you are not login");
    return;
  }

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
