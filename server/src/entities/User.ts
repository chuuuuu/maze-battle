// import { Game } from "../maze/Game";
import { Room } from "../maze/Room";
import { Role, ROLENAME } from "../maze/Role";
// import { Player } from "../maze/Player";
import { Field, ObjectType } from "type-graphql";
import { Vector } from "../utils/Vector";
import { Effect } from "../maze/Effect";
import { Node } from "../maze/Graph";

@ObjectType()
export class User {
  private static users: User[] = [];
  static createUser(username: string) {
    const id = this.users.length;
    const user: User = { id, username, rolename: ROLENAME.NOOB };
    this.users.push(user);
    return user;
  }

  static find(id: number) {
    return this.users[id];
  }

  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  rolename: ROLENAME;

  @Field({ nullable: true })
  room?: Room;

  @Field({ nullable: true })
  role?: Role;

  @Field({ nullable: true })
  node?: Node;

  @Field({ nullable: true })
  position?: Vector;

  @Field(() => [Effect], { nullable: true })
  effects?: Effect[];
}
