import http from "http";
import express from "express";
import socketio from "socket.io";
// import { v4 as uuid } from "uuid";
import { GameFactory } from "./maze/Game";
import cors from "cors";
import session from "express-session";
import { COOKIE_NAME, PROD } from "./config";
import { Player } from "./maze/Player";

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
app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html");
});

// login
app.get("/login", (req, res) => {
  console.log("login");
  req.session.user = 0;
  res.send("login successfully");
});

// logout
app.get("/logout", async (req, res) => {
  console.log("logout");
  res.clearCookie(COOKIE_NAME);

  const msg = await new Promise((resolve) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        resolve("logout fail");
        return;
      }

      resolve("logout successfully");
    });
  });

  res.send(msg);
});

app.get("/gameinfo", (_, res) => {
  // game related test
  const noobGame = GameFactory.getNoobGame();
  const player = new Player(0, "chu", noobGame.maze.mazeMap.nodes[0]);
  noobGame.register(player);
  const gameInfo = noobGame.getGameInfo(player);
  res.send(gameInfo);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("echo", (msg) => {
    console.log("message: " + msg);
    socket.emit("echo", `echo from server: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on port 5000...");
});
