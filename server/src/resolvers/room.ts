import { MyContext } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { Room, RoomFactory } from "../maze/Room";
import { MAZENAME } from "../maze/Maze";
import { User } from "../entities/User";

@ObjectType()
class RoomResponse {
  @Field(() => [String], { nullable: true })
  errors?: string[];

  @Field(() => Room, { nullable: true })
  room?: Room;
}

@Resolver()
export class RoomResolver {
  @Mutation(() => RoomResponse)
  createRoom(
    @Arg("roomname") roomname: string,
    @Arg("password") password: string,
    @Arg("mapname", () => MAZENAME) mapname: MAZENAME,
    @Ctx() { req }: MyContext
  ): RoomResponse {
    const userid = req.session.userid;
    if (userid === undefined) {
      return {
        errors: ["not login"],
      };
    }

    const room = RoomFactory.createRoom(mapname, password, roomname);

    const user = User.find(userid);
    const error = RoomFactory.join(user, room);
    if (error !== null) {
      return {
        errors: [error],
      };
    }

    return {
      room,
    };
  }

  @Mutation(() => RoomResponse)
  joinRoom(
    @Arg("roomid") roomid: number,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): RoomResponse {
    const userid = req.session.userid;
    if (userid == undefined) {
      return {
        errors: ["not login"],
      };
    }

    const room = RoomFactory.find(roomid);
    if (room === undefined) {
      return {
        errors: ["room not found"],
      };
    }

    if (password !== room.password) {
      return {
        errors: ["password invalid"],
      };
    }

    const user = User.find(userid);
    const error = RoomFactory.join(user, room);
    if (error !== null) {
      return {
        errors: [error],
      };
    }

    return {
      room,
    };
  }

  @Mutation(() => RoomResponse)
  startGame(@Ctx() { req }: MyContext): RoomResponse {
    const userid = req.session.userid;
    if (userid == undefined) {
      return {
        errors: ["not login"],
      };
    }

    const user = User.find(userid);
    const room = user.room;
    if (room === undefined) {
      return {
        errors: ["not in any room"],
      };
    }

    const error = RoomFactory.start(room);
    if (error !== null) {
      return {
        errors: [error],
      };
    }

    return {
      room,
    };
  }
}
