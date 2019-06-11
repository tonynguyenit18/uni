import {
  REQUEST,
  REQUEST_CREATE_COUPLEID,
  REQUEST_CREATE_COUPLEID_FAIL,
  REQUEST_CREATE_COUPLEID_SUCCESS,
  REQUEST_SYNC_SUCCESS,
  REQUEST_SYNC_FAIL,
  REQUEST_USERINFO_SUCCESS,
  REQUEST_USERINFO_FAIL,
  REQUEST_UPDATE_INFO_SUCCESS,
  REQUEST_UPDATE_INFO_FAIL,
  CLEAR
} from "../types";

const initialState = {
  isLoading: false,
  error: null,
  user: null,
  partner: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REQUEST_CREATE_COUPLEID:
    case REQUEST:
      return {
        ...state,
        isLoading: true
      };
      break;
    case REQUEST_CREATE_COUPLEID_SUCCESS:
    case REQUEST_SYNC_SUCCESS:
    case REQUEST_USERINFO_SUCCESS:
    case REQUEST_UPDATE_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        partner: action.payload.partner
      };
      break;
    case REQUEST_CREATE_COUPLEID_FAIL:
    case REQUEST_SYNC_FAIL:
    case REQUEST_USERINFO_FAIL:
    case REQUEST_UPDATE_INFO_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case CLEAR:
      return {
        isLoading: false,
        error: null,
        coupleID: null,
        user: null,
        partner: null
      };
    default:
      return state;
  }
}
