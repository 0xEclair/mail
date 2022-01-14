import { createLogger } from "redux-logger/src";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import { rootReducer } from "./reducers";

const log = createLogger();

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunk,
    log
  )
);