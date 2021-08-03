// package: 
// file: src/proto/test.proto

import * as jspb from "google-protobuf";

export class Change extends jspb.Message {
  getKind(): KindMap[keyof KindMap];
  setKind(value: KindMap[keyof KindMap]): void;

  getPatch(): string;
  setPatch(value: string): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  hasName(): boolean;
  clearName(): void;
  getName(): string;
  setName(value: string): void;

  hasId(): boolean;
  clearId(): void;
  getId(): string;
  setId(value: string): void;

  getNameOrIdCase(): Change.NameOrIdCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Change.AsObject;
  static toObject(includeInstance: boolean, msg: Change): Change.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Change, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Change;
  static deserializeBinaryFromReader(message: Change, reader: jspb.BinaryReader): Change;
}

export namespace Change {
  export type AsObject = {
    kind: KindMap[keyof KindMap],
    patch: string,
    tagsList: Array<string>,
    name: string,
    id: string,
  }

  export enum NameOrIdCase {
    NAME_OR_ID_NOT_SET = 0,
    NAME = 4,
    ID = 5,
  }
}

export interface KindMap {
  UPDATED: 0;
  DELETED: 1;
}

export const Kind: KindMap;

