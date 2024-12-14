import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export default {
  namespaced: true,
  state() {
    return {
      currentLocation: null,
      autoCompleteResults: [],
      currentCity: null,
      autoCompleteDishResults: [],
    };
  },
  mutations,
  actions,
  getters,
};
