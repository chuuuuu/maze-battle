import { Vector } from "src/utils/Vector";
import { Effect } from "./Effect";
import { Role, RoleFactory } from "./Role";
import { VisibleScope } from "./Scope";

interface PlayerInterface {
  // user info
  userid: number;
  username: string;

  // game info
  velocity: number;
  visibleScope: VisibleScope;
  position: Vector;
  effects: Effect[];

  // role
  role: Role;
}

export class Player implements PlayerInterface {
  // user info
  userid: number;
  username: string;

  // game info
  velocity: number;
  visibleScope: VisibleScope;
  position: Vector;
  effects: Effect[];

  // role
  role: Role;
  constructor() {
    this.role = RoleFactory.getNoob();
  }
}
