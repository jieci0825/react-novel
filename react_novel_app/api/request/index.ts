import axios from "axios";
import JcRequest from "./request";
import { BASE_URL, TIME_OUT } from "./config";

const refreshIns = axios.create();

const jcRequest: JcRequest = new JcRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  showLoading: false,
  interceptors: {
    requestInterceptor: (config) => {
      // TODO 携带 token
      return config;
    },
    responseInterceptor(res) {
      return res.data;
    },
    async responseInterceptorsCatch(error) {
      // TODO 补全错误处理，解耦
      // TODO 补全自动刷新 token
      return Promise.reject(error);
    },
  },
});

export default jcRequest;
