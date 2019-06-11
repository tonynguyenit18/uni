import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAIL,
  REQUEST_REGISTER,
  REQUEST_REGISTER_SUCCESS,
  REQUEST_REGISTER_FAIL,
  REQUEST_SYNC_SUCCESS,
  CLEAR
} from "../types";

const initialState = {
  isLoading: false,
  userInfo: null,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REQUEST_LOGIN:
    case REQUEST_REGISTER:
      return {
        ...state,
        isLoading: true
      };
      break;
    case REQUEST_LOGIN_SUCCESS:
    case REQUEST_REGISTER_SUCCESS:
    case REQUEST_SYNC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInfo: action.payload
      };
      break;
    case REQUEST_LOGIN_FAIL:
    case REQUEST_REGISTER_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case CLEAR:
      return {
        isLoading: false,
        userInfo: null,
        error: null
      };
    default:
      return state;
  }
}
