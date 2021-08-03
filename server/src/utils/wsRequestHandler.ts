import {
  WSRequest,
  WS_REQUEST_EVENT,
  ActionBody,
  QuickStartBody,
} from "../generated/wsRequest_pb";

const actionHandler = (actionBody: ActionBody) => {
  console.log(actionBody);
};

const quickStartHandler = (quickStartBody: QuickStartBody) => {
  console.log(quickStartBody);
};

export const wsRequestHandler = (wsRequest: WSRequest) => {
  const event = wsRequest.getEvent();
  switch (event) {
    case WS_REQUEST_EVENT.ACTION:
      const actionBody = wsRequest.getActionbody();
      if (!actionBody) {
        throw new Error("message format error");
      }
      actionHandler(actionBody);
      break;

    case WS_REQUEST_EVENT.QUICK_START:
      const quickStartBody = wsRequest.getQuickstartbody();
      if (!quickStartBody) {
        throw new Error("message format error");
      }
      quickStartHandler(quickStartBody);
      break;

    default:
      throw new Error("message format error");
  }
};
