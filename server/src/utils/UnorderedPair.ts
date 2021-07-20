import { hashTwoFloat, Key } from "./HashTable";
import { Vector } from "./Vector";

export class UnorderedPair {
  first: number;
  second: number;
  constructor(first: number, second: number) {
    this.first = Math.min(first, second);
    this.second = Math.max(first, second);
  }

  toVector(): Vector {
    return new Vector(this.first, this.second);
  }
}

export class UnorderedPairKey
  extends UnorderedPair
  implements Key<UnorderedPair>
{
  rawData: UnorderedPair;
  constructor(first: number, second: number) {
    super(first, second);
    this.rawData = new UnorderedPair(first, second);
  }

  hash(maximum: number): number {
    return hashTwoFloat(this.first, this.second, maximum);
  }

  equal(key: Key<UnorderedPair>): boolean {
    if (key.rawData.first !== this.first) return false;

    if (key.rawData.second !== this.second) return false;

    return true;
  }
}
