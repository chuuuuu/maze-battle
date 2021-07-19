import { Vector } from "./Vector";

export class VectorMap<T> {
  map: { [key: number]: { [key: number]: T } };
  constructor() {
    this.map = {};
  }

  insert(key: Vector, value: T): void {
    if (!(key.x in this.map)) {
      this.map[key.x] = {};
    }
    this.map[key.x][key.y] = value;
  }

  find(key: Vector): T {
    return this.map[key.x][key.y];
  }

  contain(key: Vector): boolean {
    if (!(key.x in this.map)) return false;
    if (!(key.y in this.map[key.x])) return false;
    return true;
  }

  getYs(x: number): number[] {
    return Object.keys(this.map[x]).map((str) => parseInt(str));
  }
}
