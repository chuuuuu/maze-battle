import { CircleScope, VisibleScope } from "./Scope";

export interface Role {
  name: string;
  velocity: number;
  visibleScope: VisibleScope;
}

class Noob implements Role {
  name: "noob";
  velocity: number;
  visibleScope: CircleScope;
  constructor() {
    this.velocity = 1;
    this.visibleScope = new CircleScope(3);
  }
}

export class RoleFactory {
  static getNoob(): Role {
    return new Noob();
  }
}
