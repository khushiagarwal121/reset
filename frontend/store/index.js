import { createStore } from "vuex";
import auth from "./auth";
import restaurant from "./restaurant";

const store = createStore({
  modules: {
    auth,
    restaurant,
  },
});

export default store;
