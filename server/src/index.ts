import express from "express";
import * as socketio from "socket.io";
// import { v4 as uuid } from "uuid";
import { GameFactory } from "./maze/Game";
import cors from "cors";
import session from "express-session";
import { COOKIE_NAME, PROD } from "./config";
import { Player } from "./maze/Player";
import { Node } from "./maze/Graph";
import path from "path";
const __dirname = path.resolve();

const app = express();

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
  res.sendFile(__dirname + "/src/index.html");
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

app.get("/gameinfo/:nodeid/:width/:height", (req, res) => {
  // game related test
  const nodeid = parseInt(req.params.nodeid);
  const width = parseInt(req.params.width);
  const height = parseInt(req.params.height);
  const noobGame = GameFactory.getNoobGame(width, height);
  const node: Node = noobGame.maze.mazeMap.nodes[nodeid];
  const player = new Player(0, "chu", nodeid, node.position);
  noobGame.register(player);
  const gameInfo = noobGame.getGameInfo(player);
  res.send(gameInfo);
});

const server = app.listen(5000, () => {
  console.log("listening on port 5000...");
});

const io = new socketio.Server(server);

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
