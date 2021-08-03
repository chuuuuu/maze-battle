import { Delaunay } from "d3-delaunay";
import { Field, ObjectType } from "type-graphql";
import { hashTwoFloat, Key } from "./HashTable";

@ObjectType()
export class Vector {
  @Field()
  x: number;
  @Field()
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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

export class VectorKey extends Vector implements Key<Vector> {
  rawData: Vector;
  constructor(x: number, y: number) {
    super(x, y);
    this.rawData = new Vector(x, y);
  }

  static fromPoint(point: Delaunay.Point): VectorKey {
    return new VectorKey(point[0]!, point[1]!);
  }

  hash(maximum: number): number {
    return hashTwoFloat(this.x, this.y, maximum);
  }

  equal(key: Key<Vector>): boolean {
    if (key.rawData.x !== this.x) return false;

    if (key.rawData.y !== this.y) return false;

    return true;
  }

  toVector(): Vector {
    return this.rawData;
  }
}
