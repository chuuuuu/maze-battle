import "reflect-metadata";
import express from "express";
import cors from "cors";
import session from "express-session";
import { COOKIE_NAME, PROD } from "./config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { createServer } from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";
import { RoomResolver } from "./resolvers/room";
import { GameResolver } from "./resolvers/maze";

declare module "express-session" {
  export interface SessionData {
    user: number;
  }
}

const main = async () => {
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

  const httpServer = createServer(app);
  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver, RoomResolver, GameResolver],
    validate: false,
  });
  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ req, res }): MyContext => ({ req, res }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  SubscriptionServer.create(
    {
      // This is the `schema` we just created.
      schema,
      // These are imported from `graphql`.
      execute,
      subscribe,
    },
    {
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // This `server` is the instance returned from `new ApolloServer`.
      path: apolloServer.graphqlPath,
    }
  );

  httpServer.listen(4321, () => {
    console.log("server started on localhost:4321");
  });
};

main().catch((err) => {
  console.error(err);
});
