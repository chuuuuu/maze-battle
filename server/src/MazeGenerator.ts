type Seen = boolean[][];

class Vector {
  constructor(public x: number, public y: number) {}

  static getUnitVector(direction: Direction) {
    switch (direction) {
      case Direction.UP:
        return new Vector(0, 1);
      case Direction.DOWN:
        return new Vector(0, -1);
      case Direction.LEFT:
        return new Vector(-1, 0);
      case Direction.RIGHT:
        return new Vector(1, 0);
    }
  }

  static add(vec1: Vector, vec2: Vector): Vector {
    return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
  }

  static neg(vec: Vector) {
    return new Vector(-vec.x, -vec.y);
  }
}

type Wall = boolean;

enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case Direction.UP:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.UP;
    case Direction.LEFT:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.LEFT;
  }
}

class Grid {
  walls: Wall[];
  constructor() {
    this.walls = [true, true, true, true];
  }

  setRoad(direction: Direction) {
    this.walls[direction] = false;
  }
}

class Maze {
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
