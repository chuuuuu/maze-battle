// package: 
// file: src/proto/request.proto

import * as jspb from "google-protobuf";

export class WrapperRequest extends jspb.Message {
  getCommonfield(): number;
  setCommonfield(value: number): void;

  hasReq1(): boolean;
  clearReq1(): void;
  getReq1(): Request1 | undefined;
  setReq1(value?: Request1): void;

  hasReq2(): boolean;
  clearReq2(): void;
  getReq2(): Request2 | undefined;
  setReq2(value?: Request2): void;

  getMsgCase(): WrapperRequest.MsgCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WrapperRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WrapperRequest): WrapperRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WrapperRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WrapperRequest;
  static deserializeBinaryFromReader(message: WrapperRequest, reader: jspb.BinaryReader): WrapperRequest;
}

export namespace WrapperRequest {
  export type AsObject = {
    commonfield: number,
    req1?: Request1.AsObject,
    req2?: Request2.AsObject,
  }

  export enum MsgCase {
    MSG_NOT_SET = 0,
    REQ1 = 2,
    REQ2 = 3,
  }
}

export class Request1 extends jspb.Message {
  getEvent(): EVENTMap[keyof EVENTMap];
  setEvent(value: EVENTMap[keyof EVENTMap]): void;

  getA(): string;
  setA(value: string): void;

  getB(): string;
  setB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Request1.AsObject;
  static toObject(includeInstance: boolean, msg: Request1): Request1.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Request1, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Request1;
  static deserializeBinaryFromReader(message: Request1, reader: jspb.BinaryReader): Request1;
}

export namespace Request1 {
  export type AsObject = {
    event: EVENTMap[keyof EVENTMap],
    a: string,
    b: string,
  }
}

export class Request2 extends jspb.Message {
  getEvent(): EVENTMap[keyof EVENTMap];
  setEvent(value: EVENTMap[keyof EVENTMap]): void;

  getA(): string;
  setA(value: string): void;

  getB(): string;
  setB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Request2.AsObject;
  static toObject(includeInstance: boolean, msg: Request2): Request2.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Request2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Request2;
  static deserializeBinaryFromReader(message: Request2, reader: jspb.BinaryReader): Request2;
}

export namespace Request2 {
  export type AsObject = {
    event: EVENTMap[keyof EVENTMap],
    a: string,
    b: string,
  }
}

export interface EVENTMap {
  QUICK_START: 0;
  ACTION: 1;
}

export const EVENT: EVENTMap;

