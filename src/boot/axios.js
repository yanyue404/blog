import axios from "axios";
const { accessToken } = require("../../blog.config");

global.Buffer = global.Buffer || require("buffer").Buffer;

const axiosInstance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3.html",
    Authorization: `token ${Buffer.from(accessToken, "base64").toString()}`,
  },
});

export { axiosInstance };
