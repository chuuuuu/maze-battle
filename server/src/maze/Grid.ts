import { Direction } from "../types";

export type Wall = boolean;

export class Grid {
  walls: Wall[];
  constructor() {
    this.walls = [true, true, true, true];
  }

  setRoad(direction: Direction): void {
    this.walls[direction] = false;
  }
}
