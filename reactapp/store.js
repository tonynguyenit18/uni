import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { logger } from "redux-logger";
import reduxReducer from "./src/reduxReducers";

const store = createStore(reduxReducer, applyMiddleware(logger, thunk));

export default store;
