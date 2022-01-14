import { AccountTypes } from "../action_types";
import { creteOrGetAccount } from "../../services/account";

const request = () => {
  return {
    type: AccountTypes.CREATE_REQUEST
  };
};

const success = (payload) => {
  return {
    type: AccountTypes.CREATE_SUCCESS,
    payload
  };
};

const failed = (payload) => {
  return {
    type: AccountTypes.CREATE_FAILURE,
    payload
  };
};

export const connectWallet = (seed) => {
  return async(dispatch, getState) => {
    dispatch(request());

    try {
      const programId = getState().account.programId;
      const {derivedAddress, wallet} = await creteOrGetAccount(seed, programId);

      dispatch(success({derivedAddress, wallet}));
      return true;
    }
    catch (e) {
      dispatch(failed({e}));
      return false;
    }
  };
}