// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: true,
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,
  css: [
    "@/assets/global.css",
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "vue-toastification/dist/index.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8000",
    },
  },
  plugins: ["~/plugins/vuex.js", "~/plugins/vuetify.js", "~/plugins/toast.js"],
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  ssr:false
});
