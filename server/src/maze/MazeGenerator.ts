import { getOppositeDirection } from "../utils/getOppositeDirection";
import { Direction, Seen } from "../types";
import { Vector } from "../utils/Vector";
import { Maze } from "./Maze";

export class MazeGenerator {
  width: number;
  length: number;
  idxs: number[];

  constructor(width: number, length: number) {
    this.width = width;
    this.length = length;
    this.idxs = [];
  }

  createMaze(): Maze {
    const seen: Seen = [];
    for (let i = 0; i < this.width; i++) {
      seen.push([]);
      for (let j = 0; j < this.length; j++) {
        seen[i].push(false);
      }
    }

    const maze = new Maze(this.width, this.length);
    const start: Vector = { x: 0, y: 0 };

    this.build_road(maze, seen, start);

    return maze;
  }

  build_road(maze: Maze, seen: Seen, pos: Vector): void {
    seen[pos.x][pos.y] = true;
    let directions: Direction[] = [
      Direction.UP,
      Direction.RIGHT,
      Direction.DOWN,
      Direction.LEFT,
    ];

    directions = this.shuffle(directions);
    directions.forEach((direction) => {
      const dirVec = Vector.getUnitVector(direction);
      const nextPos = Vector.add(pos, dirVec);
      if (!this.isInBoundary(nextPos)) {
        return;
      }
      if (seen[nextPos.x][nextPos.y]) {
        return;
      }

      const grid = maze.getGrid(pos);
      grid.setRoad(direction);

      const nextGrid = maze.getGrid(nextPos);
      const oppositeDirection = getOppositeDirection(direction);
      nextGrid.setRoad(oppositeDirection);

      this.build_road(maze, seen, nextPos);
    });
  }

  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  isInBoundary(pos: Vector): boolean {
    if (pos.x < 0) return false;
    if (pos.x >= this.width) return false;
    if (pos.y < 0) return false;
    if (pos.y >= this.length) return false;

    return true;
  }
}
