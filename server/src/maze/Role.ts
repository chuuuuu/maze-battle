// import { CircleScope, VisibleScope } from "./Scope";

export interface Role {
  name: string;
  velocity: number;
}

class Noob implements Role {
  name: "noob";
  velocity: number;
  constructor() {
    this.velocity = 1;
  }
}

export class RoleFactory {
  static getNoob(): Role {
    return new Noob();
  }
}
