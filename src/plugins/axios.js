//import { PORTAL_CONFIG } from "../config";
//import store from "../store";

import axios from "axios";
//import store from "../store";

//axios.defaults.baseURL = 'https://pitrack-kit.pilote.immo/pitrack/apirest.php';
axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
//axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
//axios.defaults.headers.common["App-Token"] = PORTAL_CONFIG.APP_TOKEN;

/*axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error && error.response && error.response.status === 401) {
      store.dispatch("deleteSession");
      store.dispatch("logoutUser").then(() => {
        window.location.reload();
      });
    }
    return Promise.reject(error);
  }
);*/

export default axios;

/*const fetchClient = () => {
  const defaultOptions = {
    baseURL: PORTAL_CONFIG.API_URL,
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function(config) {
    console.log(config);
    return config;
  });

  return instance;
};

export default fetchClient();*/
