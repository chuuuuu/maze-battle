import { User } from "../entities/User";
import { Vector } from "../utils/Vector";
import { Effect } from "./Effect";
import { Role, RoleManager } from "./Role";
import { Node } from "./Graph";
import { ObjectType, Field } from "type-graphql";
import { getRange } from "../utils/getRange";

@ObjectType()
export class Player {
  id: number;

  @Field(() => Role)
  role: Role;

  @Field(() => Node)
  node: Node;

  @Field(() => Vector)
  position: Vector;

  @Field(() => [Effect])
  effects: Effect[];
}

export class PlayerManager {
  static availablePlayerIndex: number[] = getRange(1, 400);
  static players: Record<number, Player> = {};
  static createPlayer(user: User, node: Node): Player {
    const playerId = this.availablePlayerIndex.pop();
    if (!playerId) {
      throw new Error("server is overloaded");
    }

    const role = RoleManager.createRole(user.rolename);
    const effects: Effect[] = [];
    const position = node.position;
    const player: Player = {
      id: playerId,
      effects,
      role,
      node,
      position,
    };

    return player;
  }

  static findOne(playerId: number): Player {
    const player = this.players[playerId];
    if (!player) {
      throw new Error("player not found");
    }

    return player;
  }
}
