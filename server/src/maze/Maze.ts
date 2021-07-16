import { Vector } from "../utils/Vector";
import { Grid } from "./Grid";

export class Maze {
  grids: Grid[][];
  constructor(width: number, length: number) {
    this.grids = [];
    for (let i = 0; i < width; i++) {
      this.grids.push([]);
      for (let j = 0; j < length; j++) {
        this.grids[i].push(new Grid());
      }
    }
  }

  getGrid(pos: Vector): Grid {
    return this.grids[pos.x][pos.y];
  }
}
