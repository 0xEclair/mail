import { Keypair } from "@solana/web3.js";
import { AccountTypes } from "../action_types/account";

const programSecretKeyString = "[213,29,154,94,248,28,95,131,81,29,3,169,123,8,199,103,31,124,11,101,251,138,60,75,247,223,104,62,212,23,243,207,48,246,212,27,50,115,18,18,96,133,39,232,39,222,99,182,197,125,22,103,234,225,86,171,88,187,181,126,30,196,45,190]";
const programSecretKey = Uint8Array.from(JSON.parse(programSecretKeyString));
const programKeypair = Keypair.fromSecretKey(programSecretKey);

const initialState = {
  loading: false,
  isError: false,
  errMsg: null,
  wallet: null,
  accountId: "",
  programId: programKeypair.publicKey
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
        errMsg: action.payload.error
      }
    }
    default: {
      return state;
    }
  }
}