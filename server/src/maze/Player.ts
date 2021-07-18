import { Vector } from "./Vector";
import { Effect } from "./Effect";
import { Index } from "./Graph";
import { Role, RoleFactory } from "./Role";
import { VisibleScope } from "./Scope";

export type PlayerInfo = {
  // user info
  userid: number;
  username: string;

  // game info
  velocity: number;
  visibleScope: VisibleScope;
  position: Vector;
  node: Index;
  effects: Effect[];

  // role
  role: Role;
};

interface PlayerInterface {
  // user info
  userid: number;
  username: string;

  // game info
  velocity: number;
  visibleScope: VisibleScope;
  position: Vector;
  node: Index;
  effects: Effect[];

  // role
  role: Role;

  getInfo: () => PlayerInfo;
}

export class Player implements PlayerInterface {
  // user info
  userid: number;
  username: string;

  // game info
  velocity: number;
  visibleScope: VisibleScope;
  position: Vector;
  node: Index;
  effects: Effect[];

  // role
  role: Role;
  constructor(userid: number, username: string, node: Index, position: Vector) {
    this.userid = userid;
    this.username = username;

    this.role = RoleFactory.getNoob();
    this.velocity = this.role.velocity;
    this.visibleScope = this.role.visibleScope;
    this.node = node;
    this.position = position;
    this.effects = [];
  }

  getInfo(): PlayerInfo {
    return {
      // user info
      userid: this.userid,
      username: this.username,

      // game info
      velocity: this.velocity,
      visibleScope: this.visibleScope,
      position: this.position,
      node: this.node,
      effects: this.effects,

      // role
      role: this.role,
    };
  }
}
