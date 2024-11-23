import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export default {
  namespaced: true,
  state() {
    return {
      user: null,
      error: null,
      loading: false,
      currentRole: null,
      signedUpUser: null,
    };
  },
  mutations,
  actions,
  getters,
};
