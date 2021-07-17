import { Vector } from "src/maze/Vector";
import { Effect } from "./Effect";
import { Node } from "./Graph";
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
  currentNode: Node;
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
  currentNode: Node;
  effects: Effect[];

  // role
  role: Role;
  constructor(userid: number, username: string, currentNode: Node) {
    this.userid = userid;
    this.username = username;
  
    this.role = RoleFactory.getNoob();
    this.velocity = this.role.velocity;
    this.visibleScope = this.role.visibleScope;
    this.currentNode = currentNode;
    this.position = currentNode.position;
    this.effects = [];  
  }
}
