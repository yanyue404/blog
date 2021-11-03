const blogConfig = require("../../blog.config");

const state = blogConfig;

const getters = {
  username(s) {
    return s.username;
  },
  repository(s) {
    return `${s.username}/${s.repository}`;
  },
  accessToken(s) {
    return s.accessToken;
  },
  blogName(s) {
    return s.blogName;
  },
  links(s) {
    return s.links;
  },
};

const mutations = {};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
