import { User } from "../entities/User";
import { Field, Int, ObjectType } from "type-graphql";
import { MAZENAME } from "./Maze";
import { Game } from "./Game";
import { getRange } from "../utils/getRange";

@ObjectType()
export class Room {
  // basic info
  @Field(() => Int)
  id: number;

  @Field()
  roomname: string;

  password: string;

  // game info
  @Field(() => MAZENAME)
  mazename: MAZENAME;

  @Field(() => [User])
  users: User[];

  isReadySet: Set<number>;

  game?: Game;
}

export class RoomManager {
  static availableRoomIndex: number[] = getRange(1, 100);
  static rooms: Record<number, Room> = {};
  static userIdToRoomId: Record<number, number> = {};
  static create(mazename: MAZENAME, password: string, roomname: string): Room {
    const roomId = this.availableRoomIndex.pop();
    if (!roomId) {
      throw new Error("server is overloaded");
    }

    const room: Room = {
      id: roomId,
      mazename,
      password,
      roomname,
      users: [],
      isReadySet: new Set<number>(),
    };
    this.rooms[roomId] = room;

    return room;
  }

  static join(room: Room, user: User) {
    room.users.push(user);
    const userId = user.id;
    const roomId = room.id;
    this.userIdToRoomId[userId] = roomId;
  }

  static findOne(roomId: number): Room {
    const room = this.rooms[roomId];
    if (!room) {
      throw new Error("room not found");
    }

    return room;
  }

  static delete(roomId: number): void {
    delete this.rooms[roomId];
    this.availableRoomIndex.push(roomId);
  }
}
