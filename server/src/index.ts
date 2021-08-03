import "reflect-metadata";
import "dotenv-safe/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import { COOKIE_NAME, PROD } from "./config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { createServer } from "http";
// import { SubscriptionServer } from "subscriptions-transport-ws";
// import { execute, subscribe } from "graphql";
import { UserResolver } from "./resolvers/user";
import { MyContext, MyRequest } from "./types";
import { RoomResolver } from "./resolvers/room";
import { NumberResolver } from "./resolvers/number";
import { createConnection } from "typeorm";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { User } from "./entities/User";
import { GameResolver } from "./resolvers/game";
import WebSocket from "ws";
import { Socket } from "node:net";
import {} from "protobufjs";

const main = async () => {
  // database setup
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    entities: [User],
    // with this, you dont need to run migration (sort of create table stuff)
    synchronize: true,
  });

  // server setup
  const app = express();

  // websocket
  app.set("view engine", "ejs");
  app.set("views", "src/views");
  app.use(express.static("src/public"));
  app.get("/websocket", (_req, res) => {
    res.render("websocket");
  });

  // redis setup
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  await redis.flushall();

  // cors
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // session setup
  const sessionMiddleware = session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: PROD, // cookie only works in https
    },
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
  });
  app.use(sessionMiddleware);

  const server = createServer(app);

  const schema = await buildSchema({
    resolvers: [
      HelloResolver,
      UserResolver,
      RoomResolver,
      NumberResolver,
      GameResolver,
    ],
    validate: false,
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  const wss = new WebSocket.Server({
    noServer: true,
  });

  server.on("upgrade", async (req: MyRequest, socket: Socket, head: Buffer) => {
    const reqAfterSessionMiddleware = await new Promise<MyRequest>(
      (resolve, _reject) => {
        const res = {} as any as express.Response;
        sessionMiddleware(req, res, (_: any) => {
          resolve(req);
        });
      }
    );

    const userId = reqAfterSessionMiddleware.session.userId;

    if (!userId) {
      wss.handleUpgrade(reqAfterSessionMiddleware, socket, head, (ws) => {
        ws.send("please login first");
        ws.close();
      });
      return;
    }

    wss.handleUpgrade(reqAfterSessionMiddleware, socket, head, (ws) => {
      ws.on("message", (message) => {
        let data;
        try {
          data = JSON.parse(message.toString());
        } catch (e) {
          ws.send("data should be json string");
          return;
        }

        if(!data.event){
          ws.send("data should contain event");
          return;
        }

        if(!data.body){
          ws.send("data should contain body");
          return;
        }
      });
    });
  });

  server.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
  });

  // SubscriptionServer.create(
  //   {
  //     // This is the `schema` we just created.
  //     schema,
  //     // These are imported from `graphql`.
  //     execute,
  //     subscribe,
  //     // https://stackoverflow.com/questions/52280481/graphql-subscription-websocket-nodejs-express-session
  //     onConnect: (_params: any, _ws: any, ctx: any) => {
  //       console.log("connect");
  //       return new Promise((resolve, _reject) => {
  //         const req = ctx.request as express.Request;
  //         const res = {} as any as express.Response;

  //         sessionMiddleware(req, res, (_: any) => {
  //           resolve({ req });
  //         });
  //       });
  //     },
  //     onDisconnect: (_webSocket: any, ctx: any)=>{
  //       console.log("disconnect");
  //       return new Promise((resolve, _reject) => {
  //         const req = ctx.request as express.Request;
  //         const res = {} as any as express.Response;

  //         sessionMiddleware(req, res, (_: any) => {
  //           resolve({ req });
  //         });
  //       });

  //     }
  //   },
  //   {
  //     // This is the `httpServer` we created in a previous step.
  //     server: httpServer,
  //     // This `server` is the instance returned from `new ApolloServer`.
  //     path: apolloServer.graphqlPath,
  //   }
  // );

  // httpServer.listen(process.env.PORT, () => {
  //   console.log(`server started on port ${process.env.PORT}`);
  // });
};

main().catch((err) => {
  console.error(err);
});
