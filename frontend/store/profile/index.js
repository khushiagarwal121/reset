import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export default {
  namespaced: true,
  state() {
    return {
      owner: {
        firstName: "",
        lastName: "",
        countryCode: "+91",
        phoneNumber: "",
        email: "",
        date_of_birth: null,
      },
      originalOwner: {},
      isUpdated: false,
    };
  },
  mutations,
  actions,
  getters,
};
