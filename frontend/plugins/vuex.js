import { createStore } from "vuex";
import auth from "../store/auth";
import cuisine from "../store/cuisine";
import search from "../store/search";
import menu from "../store/menu";
import profile from "../store/profile";

export default defineNuxtPlugin((nuxtApp) => {
  const store = createStore({
    modules: {
      auth,
      cuisine,
      search,
      menu,
      profile,
    },
  });

  nuxtApp.vueApp.use(store);
});
