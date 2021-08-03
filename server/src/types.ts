import { Request, Response } from "express";
import { Session } from "express-session";
import Redis from "ioredis";

export type MyRequest = Request & { session: Session & { userId?: number, roomId?: number, isReady?: boolean } };

export type MyContext = {
  req: MyRequest;
  res: Response;
  redis: Redis.Redis;
};
