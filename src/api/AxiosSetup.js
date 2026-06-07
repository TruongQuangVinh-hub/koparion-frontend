import axios from "axios";
import { API_URL } from "../constant";

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

instance.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

export default instance;