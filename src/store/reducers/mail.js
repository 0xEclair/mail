import { MailTypes } from "../action_types";

const initial = {
  loading: false,
  isError: false,
  errMsg: null,
  inbox: [],
  sent: []
};

export const mail = (state = initial, action) => {
  switch (action.type) {
    case MailTypes.GET_REQUEST:
    case MailTypes.SEND_REQUEST: {
      return {
        ...state,
        isError: false,
        errMsg: null,
        loading: true
      };
    }
    case MailTypes.GET_SUCCESS:
    case MailTypes.SEND_SUCCESS: {
      return {
        ...state,
        loading: false,
        inbox: action.payload.inbox,
        sent: action.payload.sent
      };
    }
    case MailTypes.GET_FAILURE:
    case MailTypes.SEND_FAILURE: {
      return {
        ...state,
        loading: false,
        isError: true,
        errMsg: action.payload.message
      };
    }
    default: {
      return state;
    }
  }
}