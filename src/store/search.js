const state = {
  searchKeyWords: "node"
};

const getters = {
  searchKeyWords(s) {
    return `${s.searchKeyWords}`;
  }
};

const mutations = {
  keyWordChange(s, newText) {
    s.searchKeyWords = newText;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
