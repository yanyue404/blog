import axios from 'axios';
import account from '../store/account';

const axiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3.html',
    Authorization: `token ${window.atob(account.state.accessToken)}`,
  },
});

export default async ({ Vue }) => {
  Vue.prototype.$axios = axiosInstance;
};

export { axiosInstance };
