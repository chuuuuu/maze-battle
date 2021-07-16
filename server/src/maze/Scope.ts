import { Vector } from "src/utils/Vector";

export interface VisibleScope {
  isInBoundary: (pos1: Vector, pos2: Vector) => boolean;
}

export class RectScope implements VisibleScope {
  width: number;
  height: number;

  isInBoundary(pos1: Vector, pos2: Vector): boolean {
    if (Math.abs(pos1.x - pos2.x) > this.width) {
      return false;
    }
    if (Math.abs(pos1.y - pos2.y) > this.height) {
      return false;
    }

    return true;
  }
}

export class CircleScope implements VisibleScope {
  radius: number;
  constructor(radius: number) {
    this.radius = radius;
  }

  isInBoundary(pos1: Vector, pos2: Vector): boolean {
    if (Vector.distance(pos1, pos2) > this.radius) {
      return false;
    }

    return true;
  }
}
