import { combineReducers } from "redux";
import { page } from "./page";
import { account } from "./account";
import { mail } from "./mail";

export const rootReducer = combineReducers({
  page,
  account,
  mail
});