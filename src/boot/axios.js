import axios from "axios";
import account from "../store/account";

global.Buffer = global.Buffer || require("buffer").Buffer;

const axiosInstance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3.html",
    Authorization: `token ${Buffer.from(
      account.state.accessToken,
      "base64"
    ).toString()}`,
  },
});

export default async ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
};

export { axiosInstance };
