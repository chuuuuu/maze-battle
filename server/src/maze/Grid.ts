import { Direction } from "../types";
import { Wall } from "../types";

export class Grid {
  walls: Wall[];
  constructor() {
    this.walls = [true, true, true, true];
  }

  setRoad(direction: Direction): void {
    this.walls[direction] = false;
  }
}
