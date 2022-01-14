import { MailTypes } from "../action_types";
import { fetchData, send } from "../../services";

export const getAccountData = () => {
  return async (dispatch, getState) => {
    dispatch(request());

    try {
      const accountId = getState().account.accountId;
      const mailAccount = await fetchData(accountId);

      dispatch(success({
        inbox: mailAccount.inbox,
        sent: mailAccount.sent
      }));
    }
    catch (e) {
      console.log(e);
      dispatch(failed({
        message: e.message
      }));
    }
  };

  function request() { return {type: MailTypes.GET_REQUEST}}
  function success(payload) { return {type: MailTypes.GET_SUCCESS, payload}}
  function failed(payload) { return {type: MailTypes.GET_FAILURE, payload}}
}

export const sendMail = async (mail) => {
  return async (dispatch, getState) => {
    dispatch(request());

    try {
      const programId = getState().account.programId;
      const wallet = getState().account.wallet;

      await send(mail,programId, wallet);
      const accountId = getState().account.accountId;
      const mailAccount = await fetchData(accountId);

      dispatch(success({
        inbox: mailAccount.inbox,
        sent: mailAccount.sent
      }));
    }
    catch (e) {
      console.log(e);
      dispatch(failed({
        message: e.message
      }));
    }
  };

  function request() { return {type: MailTypes.SEND_REQUEST}}
  function success(payload) { return {type: MailTypes.SEND_SUCCESS, payload}}
  function failed(payload) { return {type: MailTypes.SEND_FAILURE, payload}}
}