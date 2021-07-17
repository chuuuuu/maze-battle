import { Vector } from "src/utils/Vector";

export type Rect = {
  leftTopPoint: Vector;
  rightDownPoint: Vector;
};

export interface VisibleScope {
  isInBoundary: (pos1: Vector, pos2: Vector) => boolean;
  // gives you all possible boundary
  getBoundary: (pos: Vector) => Rect;
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

  getBoundary(pos: Vector): Rect {
    const leftTopPoint = {
      x: pos.x - this.width,
      y: pos.y - this.height,
    };
    const rightDownPoint = {
      x: pos.x + this.width,
      y: pos.y + this.height,
    };

    return {
      leftTopPoint,
      rightDownPoint,
    };
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

  getBoundary(pos: Vector): Rect {
    const leftTopPoint = {
      x: pos.x - this.radius,
      y: pos.y - this.radius,
    };
    const rightDownPoint = {
      x: pos.x + this.radius,
      y: pos.y + this.radius,
    };

    return {
      leftTopPoint,
      rightDownPoint,
    };
  }

}
