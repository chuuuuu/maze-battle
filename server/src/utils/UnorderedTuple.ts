import { Vector } from "./Vector";

export class UnorderedTuple {
  static getVector(x: number, y: number): Vector {
    if (x > y) {
      [x, y] = [y, x];
    }

    return new Vector(x, y);
  }
}
