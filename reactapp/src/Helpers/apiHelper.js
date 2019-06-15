import axios from "axios";
import { BASE_URL } from "../config";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-type": "application/json"
  }
});

export const postMemory = (token, body) => {
  const config = {
    headers: {
      "x-auth-token": token
    }
  };

  return axiosInstance.post("api/couple/add_memory", body, config);
};

export const postEvent = (token, body) => {
  const config = {
    headers: {
      "x-auth-token": token
    }
  };

  return axiosInstance.post("api/couple/add_event", body, config);
};
