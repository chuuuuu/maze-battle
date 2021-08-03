// package: 
// file: src/proto/wsRequest.proto

import * as jspb from "google-protobuf";

export class WSRequest extends jspb.Message {
  getEvent(): WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap];
  setEvent(value: WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap]): void;

  hasQuickstartbody(): boolean;
  clearQuickstartbody(): void;
  getQuickstartbody(): QuickStartBody | undefined;
  setQuickstartbody(value?: QuickStartBody): void;

  hasActionbody(): boolean;
  clearActionbody(): void;
  getActionbody(): ActionBody | undefined;
  setActionbody(value?: ActionBody): void;

  getBodyCase(): WSRequest.BodyCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WSRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WSRequest): WSRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WSRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WSRequest;
  static deserializeBinaryFromReader(message: WSRequest, reader: jspb.BinaryReader): WSRequest;
}

export namespace WSRequest {
  export type AsObject = {
    event: WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap],
    quickstartbody?: QuickStartBody.AsObject,
    actionbody?: ActionBody.AsObject,
  }

  export enum BodyCase {
    BODY_NOT_SET = 0,
    QUICKSTARTBODY = 2,
    ACTIONBODY = 3,
  }
}

export class QuickStartBody extends jspb.Message {
  getEvent(): WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap];
  setEvent(value: WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap]): void;

  getA(): string;
  setA(value: string): void;

  getB(): string;
  setB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuickStartBody.AsObject;
  static toObject(includeInstance: boolean, msg: QuickStartBody): QuickStartBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuickStartBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuickStartBody;
  static deserializeBinaryFromReader(message: QuickStartBody, reader: jspb.BinaryReader): QuickStartBody;
}

export namespace QuickStartBody {
  export type AsObject = {
    event: WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap],
    a: string,
    b: string,
  }
}

export class ActionBody extends jspb.Message {
  getEvent(): WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap];
  setEvent(value: WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap]): void;

  getA(): string;
  setA(value: string): void;

  getB(): string;
  setB(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActionBody.AsObject;
  static toObject(includeInstance: boolean, msg: ActionBody): ActionBody.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ActionBody, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActionBody;
  static deserializeBinaryFromReader(message: ActionBody, reader: jspb.BinaryReader): ActionBody;
}

export namespace ActionBody {
  export type AsObject = {
    event: WS_REQUEST_EVENTMap[keyof WS_REQUEST_EVENTMap],
    a: string,
    b: string,
  }
}

export interface WS_REQUEST_EVENTMap {
  QUICK_START: 0;
  ACTION: 1;
}

export const WS_REQUEST_EVENT: WS_REQUEST_EVENTMap;

