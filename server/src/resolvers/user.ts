import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../config";
import { Room, RoomManager } from "../maze/Room";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => [Room])
  room(@Ctx() { req }: MyContext): Room {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error("you should login first");
    }

    const roomId = req.session.userId;
    if (!roomId) {
      throw new Error("you haven't join any room yet");
    }

    const room = RoomManager.findOne(roomId);

    return room;
  }

  @FieldResolver(() => [Boolean])
  isReady(@Root() user: User, @Ctx() { req }: MyContext): boolean {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error("you should login first");
    }

    const roomId = req.session.userId;
    if (!roomId) {
      throw new Error("you haven't join any room yet");
    }

    const room = RoomManager.findOne(roomId);

    return room.isReadySet.has(user.id);
  }

  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const userId = req.session.userId;
    if (userId) {
      throw new Error("you should logout first");
    }

    const hashedPassword = await argon2.hash(password);

    const user = User.create({ username, password: hashedPassword });

    try {
      await user.save();
    } catch (err) {
      // duplicate username error
      if (err.code === "23505") {
        throw new Error("username already taken");
      }
    }

    req.session.userId = user.id;
    req.session.isReady = false;

    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const userId = req.session.userId;
    if (userId) {
      throw new Error("you should logout first");
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("username not exists");
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      throw new Error("incorrect password");
    }

    req.session.userId = user.id;
    req.session.isReady = false;

    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res, req }: MyContext): Promise<boolean> {
    res.clearCookie(COOKIE_NAME);

    return await new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext): Promise<User | undefined> | null {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }
}
