import { User } from "../entities/User";
import { Field, ObjectType } from "type-graphql";
import { Item } from "./Item";
import { Maze, MazeFactory, MAZENAME } from "./Maze";
import { RoleFactory } from "./Role";

@ObjectType()
export class Room {
  @Field()
  id: number;
  @Field()
  roomname: string;
  password: string;
  @Field(() => MAZENAME)
  mapname: MAZENAME;
  @Field(() => [User])
  users: User[];
  @Field({ nullable: true })
  maze?: Maze;
  @Field(() => [Item], { nullable: true })
  items?: Item[];
}

export class RoomFactory {
  private static rooms: Room[] = [];
  static createRoom(
    mapname: MAZENAME,
    password: string,
    roomname: string
  ): Room {
    const id = this.rooms.length;
    const room: Room = { id, mapname, password, roomname, users: [] };
    this.rooms.push(room);
    return room;
  }

  static find(id: number) {
    return this.rooms[id];
  }

  static join(user: User, room: Room): string | null {
    if (user.room !== undefined) {
      console.log(user.room);
      return "user already in a room";
    }

    const maxUserNum = 2;
    if (room.users.length >= maxUserNum) {
      return "room has been full";
    }

    room.users.push(user);
    user.room = room;
    return null;
  }

  static start(room: Room): string | null {
    const minUserNum = 2;
    if (room.users.length !== minUserNum) {
      return "users number need to be greater than 2";
    }

    room.items = [];
    room.maze = MazeFactory.createMaze(room.mapname);
    room.users.forEach((user) => {
      user.role = RoleFactory.createRole(user.rolename);
      user.effects = [];
      user.node = room.maze?.mazeMap.nodes[0];
      user.position = user.node?.position;
    });
    return null;
  }
}
