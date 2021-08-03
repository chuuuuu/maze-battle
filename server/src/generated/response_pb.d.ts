// package: 
// file: src/proto/response.proto

import * as jspb from "google-protobuf";

export class WrapperResponse extends jspb.Message {
  getCommonfield(): number;
  setCommonfield(value: number): void;

  hasRes1(): boolean;
  clearRes1(): void;
  getRes1(): Response1 | undefined;
  setRes1(value?: Response1): void;

  hasRes2(): boolean;
  clearRes2(): void;
  getRes2(): Response2 | undefined;
  setRes2(value?: Response2): void;

  getMsgCase(): WrapperResponse.MsgCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WrapperResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WrapperResponse): WrapperResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WrapperResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WrapperResponse;
  static deserializeBinaryFromReader(message: WrapperResponse, reader: jspb.BinaryReader): WrapperResponse;
}

export namespace WrapperResponse {
  export type AsObject = {
    commonfield: number,
    res1?: Response1.AsObject,
    res2?: Response2.AsObject,
  }

  export enum MsgCase {
    MSG_NOT_SET = 0,
    RES1 = 2,
    RES2 = 3,
  }
}

export class Response1 extends jspb.Message {
  getEvent(): EVENTMap[keyof EVENTMap];
  setEvent(value: EVENTMap[keyof EVENTMap]): void;

  getA(): string;
  setA(value: string): void;

  getB(): string;
  setB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response1.AsObject;
  static toObject(includeInstance: boolean, msg: Response1): Response1.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Response1, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response1;
  static deserializeBinaryFromReader(message: Response1, reader: jspb.BinaryReader): Response1;
}

export namespace Response1 {
  export type AsObject = {
    event: EVENTMap[keyof EVENTMap],
    a: string,
    b: string,
  }
}

export class Response2 extends jspb.Message {
  getEvent(): EVENTMap[keyof EVENTMap];
  setEvent(value: EVENTMap[keyof EVENTMap]): void;

  getA(): string;
  setA(value: string): void;

  getB(): string;
  setB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response2.AsObject;
  static toObject(includeInstance: boolean, msg: Response2): Response2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Response2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response2;
  static deserializeBinaryFromReader(message: Response2, reader: jspb.BinaryReader): Response2;
}

export namespace Response2 {
  export type AsObject = {
    event: EVENTMap[keyof EVENTMap],
    a: string,
    b: string,
  }
}

export interface EVENTMap {
  OPPONENT_INFO: 0;
  GAME_INFO: 1;
}

export const EVENT: EVENTMap;

