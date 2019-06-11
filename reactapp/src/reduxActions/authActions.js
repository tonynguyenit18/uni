import {
  REQUEST_LOGIN,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_FAIL,
  REQUEST_REGISTER,
  REQUEST_REGISTER_SUCCESS,
  REQUEST_REGISTER_FAIL
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

export const login = body => dispatch => {
  dispatch({
    type: REQUEST_LOGIN
  });
  axiosInstance
    .post("api/auth", body)
    .then(res =>
      dispatch({
        type: REQUEST_LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      let error = err.response
        ? err.response.data
        : { msg: "Check your internet connection." };
      dispatch({
        type: REQUEST_LOGIN_FAIL,
        error: error
      });
    });
};

export const register = body => dispatch => {
  dispatch({
    type: REQUEST_REGISTER
  });

  axiosInstance
    .post("api/user", body)
    .then(response =>
      dispatch({
        type: REQUEST_REGISTER_SUCCESS,
        payload: response.data
      })
    )
    .catch(err => {
      console.log("err ", err);
      let error = err.response
        ? err.response.data
        : { msg: "Check your internet connection." };
      dispatch({
        type: REQUEST_REGISTER_FAIL,
        error: error
      });
    });
};
