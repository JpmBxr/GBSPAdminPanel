import axios from "axios";
import { Global } from "../helpers/global";
import router from "@/router/router";
// #region Axios Setting
axios.defaults.baseURL = Global.getBaseUrl();
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.interceptors.request.use(
  (config) => {
    const urlExcludedFromToken = ["/login"];
    if (urlExcludedFromToken.indexOf(config.url) === -1) {
      config.headers.Authorization = `Bearer ${secureLS.get(Global.tokenKey)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401 || error.response.status == 403) {
      Global.showErrorAlert(true, "error", "You are unauthorized");
      secureLS.removeAll();
      router.push({ name: "Login" });
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// #endregion

export const ApiService = {
  // #region Get
  get(endPoint, params) {
    return axios.get(endPoint, {
      params: params,
    });
  },
  // #endregion

  // #region Post
  post(endPoint, params) {
    return axios.post(endPoint, params);
  },
  // #endregion

  // #region Put
  put(endPoint, params) {
    return axios.put(endPoint, params);
  },
  // #endregion

  // #region Post with Image
  postWithImage(endPoint, params) {
    return axios.post(endPoint, params, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  },

   // download file
   download(endPoint) {
    return axios.get(endPoint, {
      responseType: "blob",
    });
  },
  // #endregion
};
