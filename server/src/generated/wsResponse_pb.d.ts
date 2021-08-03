// package: 
// file: src/proto/wsResponse.proto

import * as jspb from "google-protobuf";

export class WSResponse extends jspb.Message {
  getEvent(): WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap];
  setEvent(value: WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap]): void;

  hasOpponentbody(): boolean;
  clearOpponentbody(): void;
  getOpponentbody(): OpponentBody | undefined;
  setOpponentbody(value?: OpponentBody): void;

  hasGamebody(): boolean;
  clearGamebody(): void;
  getGamebody(): GameBody | undefined;
  setGamebody(value?: GameBody): void;

  getBodyCase(): WSResponse.BodyCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WSResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WSResponse): WSResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WSResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WSResponse;
  static deserializeBinaryFromReader(message: WSResponse, reader: jspb.BinaryReader): WSResponse;
}

export namespace WSResponse {
  export type AsObject = {
    event: WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap],
    opponentbody?: OpponentBody.AsObject,
    gamebody?: GameBody.AsObject,
  }

  export enum BodyCase {
    BODY_NOT_SET = 0,
    OPPONENTBODY = 2,
    GAMEBODY = 3,
  }
}

export class OpponentBody extends jspb.Message {
  getEvent(): WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap];
  setEvent(value: WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap]): void;

  getA(): string;
  setA(value: string): void;

  getB(): string;
  setB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpponentBody.AsObject;
  static toObject(includeInstance: boolean, msg: OpponentBody): OpponentBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OpponentBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpponentBody;
  static deserializeBinaryFromReader(message: OpponentBody, reader: jspb.BinaryReader): OpponentBody;
}

export namespace OpponentBody {
  export type AsObject = {
    event: WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap],
    a: string,
    b: string,
  }
}

export class GameBody extends jspb.Message {
  getEvent(): WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap];
  setEvent(value: WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap]): void;

  getA(): string;
  setA(value: string): void;

  getB(): string;
  setB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameBody.AsObject;
  static toObject(includeInstance: boolean, msg: GameBody): GameBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GameBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameBody;
  static deserializeBinaryFromReader(message: GameBody, reader: jspb.BinaryReader): GameBody;
}

export namespace GameBody {
  export type AsObject = {
    event: WS_RESPONSE_EVENTMap[keyof WS_RESPONSE_EVENTMap],
    a: string,
    b: string,
  }
}

export interface WS_RESPONSE_EVENTMap {
  OPPONENT: 0;
  GAME: 1;
}

export const WS_RESPONSE_EVENT: WS_RESPONSE_EVENTMap;

