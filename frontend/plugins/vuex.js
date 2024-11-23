import { createStore } from "vuex";
import auth from "../store/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const store = createStore({
    modules: {
      auth,
    },
  });

  nuxtApp.vueApp.use(store);
});
