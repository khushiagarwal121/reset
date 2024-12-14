import { createStore } from "vuex";
import auth from "./auth";
import cuisine from "./cuisine";
import search from "./search";
import menu from "./menu";
import profile from "./profile";

const store = createStore({
  modules: {
    auth,
    cuisine,
    search,
    menu,
    profile,
  },
});

export default store;
