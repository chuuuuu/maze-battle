export class Vector {
  constructor(public x: number, public y: number) {}
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
