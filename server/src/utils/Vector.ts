import { Direction } from "../types";

export class Vector {
  constructor(public x: number, public y: number) {}

  static getUnitVector(direction: Direction): Vector {
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

  static neg(vec: Vector): Vector {
    return new Vector(-vec.x, -vec.y);
  }

  static minus(vec1: Vector, vec2: Vector): Vector {
    return new Vector(vec1.x - vec2.x, vec1.y - vec2.y);
  }

  static abs(vec: Vector): number {
    return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
  }

  static distance(vec1: Vector, vec2: Vector): number {
    return Vector.abs(Vector.minus(vec1, vec2));
  }
}
