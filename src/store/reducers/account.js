import { Keypair, PublicKey } from "@solana/web3.js";
import { AccountTypes } from "../action_types/account";

const initialState = {
  loading: false,
  isError: false,
  errMsg: null,
  wallet: null,
  accountId: "",
  programId: new PublicKey("4HSimHydcZMv3q9kdWgbursuBYjetks1gp3txctUJnuM")
};

export const account = (state = initialState, action) => {
  switch (action.type) {
    case AccountTypes.CREATE_REQUEST: {
      return {
        ...state,
        isError: false,
        errMsg: null,
        loading: true
      };
    }
    case AccountTypes.CREATE_SUCCESS: {
      return {
        ...state,
        loading: false,
        wallet: action.payload.wallet,
        accountId: action.payload.derivedAddress
      };
    }
    case AccountTypes.CREATE_FAILURE: {
      return {
        ...state,
        loading: false,
        isError: true,
        errMsg: action.payload
      }
    }
    default: {
      return state;
    }
  }
}