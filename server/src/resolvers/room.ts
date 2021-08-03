import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Room, RoomManager } from "../maze/Room";
import { MAZENAME } from "../maze/Maze";
import { User } from "../entities/User";

@Resolver(Room)
export class RoomResolver {
  @Query(() => Room, { nullable: true })
  async room(@Arg("roomId") roomId: number): Promise<Room> {
    const room = await RoomManager.findOne(roomId);
    return room;
  }

  @Mutation(() => Room)
  async createRoom(
    @Arg("roomname") roomname: string,
    @Arg("password") password: string,
    @Arg("mazename", () => MAZENAME) mapname: MAZENAME,
    @Ctx() { req }: MyContext
  ): Promise<Room> {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error("not login");
    }

    if (req.session.roomId) {
      throw new Error("you have already been in a room");
    }

    const user = await User.findOne(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const room = RoomManager.create(mapname, password, roomname);

    RoomManager.join(room, user);
    req.session.roomId = room.id;

    return room;
  }

  @Mutation(() => Room)
  async joinRoom(
    @Arg("roomid") roomId: number,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<Room> {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error("not login");
    }

    if (req.session.roomId) {
      throw new Error("you have already been in a room");
    }

    const user = await User.findOne(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const room = RoomManager.findOne(roomId);

    const maxUserNum = 2;
    if (room.users.length >= maxUserNum) {
      throw Error("room has been full");
    }

    if (password !== room.password) {
      throw new Error("incorrect password");
    }

    room.users.push(user);

    req.session.roomId = room.id;

    return room;
  }

  @Mutation(() => Boolean)
  async leaveRoom(@Ctx() { req }: MyContext): Promise<boolean> {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error("not login");
    }

    const roomId = req.session.roomId;
    if (!roomId) {
      throw new Error("you are not in any room");
    }

    const room = RoomManager.findOne(roomId);
    room.users = room.users.filter((user) => user.id != userId);
    req.session.roomId = undefined;

    if(room.users.length === 0){
      RoomManager.delete(roomId);
    }

    return true;
  }
}
