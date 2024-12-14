import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

export default {
  namespaced: true,
  state() {
    return {
      selectedCuisines: [],
      savedCuisines: [],
      cuisines: [],
    };
  },
  mutations,
  getters,
  actions,
};
