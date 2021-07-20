export function hashTwoFloat(x: number, y: number, maximum: number): number {
  x = (x * 18397) % maximum;
  y = (y * 20483) % maximum;
  return Math.floor((((x + y) * (x + y + 1)) / 2 + x) % maximum);
}

export interface Key<T> {
  rawData: T;
  hash: (maximum: number) => number;
  equal: (key: Key<T>) => boolean;
}

export class numberKey implements Key<number> {
  rawData: number;
  hash(maximum: number): number {
    return this.rawData % maximum;
  }

  equal(key: Key<number>): boolean {
    return key.rawData == this.rawData;
  }
}

export type KeyValuePair<S, T> = {
  key: Key<S>;
  value: T;
};

// let collision = 0;

export class KeyValueList<S, T> {
  keyValuePairList: KeyValuePair<S, T>[];
  constructor() {
    this.keyValuePairList = [];
  }

  find(key: Key<S>): T | null {
    for (let i = 0; i < this.keyValuePairList.length; i++) {
      const pair = this.keyValuePairList[i];
      if (key.equal(pair.key)) {
        return pair.value;
      }
    }

    return null;
  }

  insert(pair: KeyValuePair<S, T>): void {
    for (let i = 0; i < this.keyValuePairList.length; i++) {
      if (pair.key.equal(this.keyValuePairList[i].key)) {
        this.keyValuePairList[i] = pair;
        return;
      }
    }

    // if (this.keyValuePairList.length > 1) {
    //   collision++;
    //   console.log(collision);
    //   console.log(this.keyValuePairList);
    // }
    this.keyValuePairList.push(pair);
  }

  getKVPairs(): KeyValuePair<S, T>[] {
    return this.keyValuePairList;
  }
}

export class HashTable<S, T> {
  table: KeyValueList<S, T>[];
  numKeyValuePair: number;
  constructor() {
    this.newArrayOfKeyValueList(1);
    this.numKeyValuePair = 0;
  }

  private newArrayOfKeyValueList(size: number) {
    this.table = [];
    for (let i = 0; i < size; i++) {
      this.table.push(new KeyValueList<S, T>());
    }
  }

  find(key: Key<S>): T | null {
    const hash = key.hash(this.table.length);
    const kvList = this.table[hash];
    return kvList.find(key);
  }

  insert(pair: KeyValuePair<S, T>): void {
    if (this.table.length * 0.1 < this.numKeyValuePair) {
      this.expand();
    }

    const hash = pair.key.hash(this.table.length);
    const kvList = this.table[hash];
    kvList.insert(pair);

    this.numKeyValuePair++;
  }

  kvPairs(): KeyValuePair<S, T>[] {
    const ret: KeyValuePair<S, T>[] = [];
    this.table.forEach((kvList) => {
      const kvPairs = kvList.getKVPairs();
      ret.concat(kvPairs);
    });

    return ret;
  }

  keys(): Key<S>[] {
    return this.kvPairs().map((pair) => pair.key);
  }

  values(): T[] {
    return this.kvPairs().map((pair) => pair.value);
  }

  exist(key: Key<S>): boolean {
    return this.find(key) === null ? false : true;
  }

  private expand(): void {
    const oldTable = this.table;
    const oldLen = oldTable.length;
    this.newArrayOfKeyValueList(2 * oldLen);
    oldTable.forEach((kvList) => {
      const kvPairs = kvList.getKVPairs();
      kvPairs.forEach((pair) => {
        const hash = pair.key.hash(this.table.length);
        const kvList = this.table[hash];
        kvList.insert(pair);
      });
    });
  }
}
