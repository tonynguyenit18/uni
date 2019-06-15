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
  REQUEST_COUPLE_INFO_FAIL,
  REQUEST_COUPLE_INFO_SUCCESS,
  CLEAR
} from "../types";
import axios from "axios";
import { BASE_URL } from "../config";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-type": "application/json"
  }
});

export const getUserInfo = token => dispatch => {
  const config = {
    headers: {
      "x-auth-token": token
    }
  };

  dispatch({ type: REQUEST });

  axiosInstance
    .get("api/user", config)
    .then(response =>
      dispatch({
        type: REQUEST_USERINFO_SUCCESS,
        payload: response.data
      })
    )
    .catch(err => {
      let error = err.response
        ? err.response.data
        : { msg: "Check your internet connection." };
      dispatch({
        type: REQUEST_USERINFO_FAIL,
        error: error
      });
    });
};

export const getCoupleInfo = (token, coupleID) => dispatch => {
  const config = {
    headers: {
      "x-auth-token": token
    }
  };

  axiosInstance
    .get(`api/couple?coupleID=${coupleID}`, config)
    .then(response =>
      dispatch({
        type: REQUEST_COUPLE_INFO_SUCCESS,
        payload: response.data
      })
    )
    .catch(err => {
      let error = err.response
        ? err.response.data
        : { msg: "Check your internet connection." };
      dispatch({
        type: REQUEST_COUPLE_INFO_FAIL,
        error: error
      });
    });
};

export const createCoupleID = token => dispatch => {
  const config = {
    headers: {
      "x-auth-token": token
    }
  };

  dispatch({ type: REQUEST_CREATE_COUPLEID });

  axiosInstance
    .post("api/user/create_couple_id", {}, config)
    .then(response =>
      dispatch({
        type: REQUEST_CREATE_COUPLEID_SUCCESS,
        payload: response.data
      })
    )
    .catch(err => {
      let error = err.response
        ? err.response.data
        : { msg: "Check your internet connection." };
      dispatch({
        type: REQUEST_CREATE_COUPLEID_FAIL,
        error: error
      });
    });
};

export const sycnCoupleID = (token, body) => dispatch => {
  dispatch({
    type: REQUEST
  });

  const config = {
    headers: {
      "x-auth-token": token
    }
  };

  axiosInstance
    .post("api/user/sync_couple_id", body, config)
    .then(response =>
      dispatch({
        type: REQUEST_SYNC_SUCCESS,
        payload: response.data
      })
    )
    .catch(err => {
      let error = err.response
        ? err.response.data
        : { msg: "Check your internet connection." };
      dispatch({
        type: REQUEST_SYNC_FAIL,
        error: error
      });
    });
};

export const clearState = () => dispatch => {
  dispatch({
    type: CLEAR
  });
};

export const updateUserInfo = (token, body) => dispatch => {
  dispatch({ type: REQUEST });
  const config = {
    headers: {
      "x-auth-token": token
    }
  };

  axiosInstance
    .post("api/user/update", body, config)
    .then(response =>
      dispatch({
        type: REQUEST_UPDATE_INFO_SUCCESS,
        payload: response.data
      })
    )
    .catch(err => {
      console.log("err ", err);
      let error = err.response
        ? err.response.data
        : { msg: "Check your internet connection." };
      dispatch({
        type: REQUEST_UPDATE_INFO_FAIL,
        error: error
      });
    });
};
