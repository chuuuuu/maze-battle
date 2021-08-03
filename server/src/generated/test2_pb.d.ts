// package: 
// file: src/proto/test2.proto

import * as jspb from "google-protobuf";

export class Change2 extends jspb.Message {
  getKind(): Kind2Map[keyof Kind2Map];
  setKind(value: Kind2Map[keyof Kind2Map]): void;

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

  getNameOrIdCase(): Change2.NameOrIdCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Change2.AsObject;
  static toObject(includeInstance: boolean, msg: Change2): Change2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Change2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Change2;
  static deserializeBinaryFromReader(message: Change2, reader: jspb.BinaryReader): Change2;
}

export namespace Change2 {
  export type AsObject = {
    kind: Kind2Map[keyof Kind2Map],
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

export interface Kind2Map {
  UPDATED: 0;
  DELETED: 1;
}

export const Kind2: Kind2Map;

