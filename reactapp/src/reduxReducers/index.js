import { combineReducers } from "redux";
import authReducer from "./authReducer";
import userRecuder from "./userReducers";

export default combineReducers({
  auth: authReducer,
  userInfo: userRecuder
});
