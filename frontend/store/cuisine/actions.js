import { useApi } from "~/composables/useApi";
import { useToast } from "vue-toastification";

export default {
  fetchCuisines: async function ({ commit }) {
    const { api } = useApi();
    const toast = useToast();
    try {
      const response = await api.get("/api/v1/cuisines");

      const cuisineData = response.data?.data;
      commit("SET_CUISINES", cuisineData);
      return cuisineData;
    } catch (error) {
      toast.error("Failed to load available cuisines. Try again later!");
      console.log(error);
    }
  },
  fetchSavedCuisines: async function ({ commit }) {
    const { api } = useApi();
    const toast = useToast();
    try {
      const response = await api.get(`/api/v1/cuisines/restaurant`);
      const cuisineData = response.data?.data;
      // Transform cuisineData to extract only name and uuid
      const savedCuisines = cuisineData.map((cuisine) => ({
        uuid: cuisine.uuid,
        name: cuisine.name,
      }));

      commit("SET_SAVED_CUISINES", savedCuisines);
      return savedCuisines;
    } catch (error) {
      console.log(error);
      toast.error("Failed to load saved cuisines. Try again later!");
    }
  },
  saveCuisines: async function ({ commit }, cuisines) {
    const { api } = useApi();
    const toast = useToast();
    try {
      const response = await api.patch("/api/v1/cuisines", {
        cuisines,
      });
      const cuisineData = response.data?.data;
      // Transform cuisineData to extract only name and uuid
      const savedCuisines = cuisineData.map((cuisine) => ({
        uuid: cuisine.uuid,
        name: cuisine.name,
      }));

      // Commit the transformed data to the Vuex state
      commit("ADD_SAVED_CUISINES", savedCuisines);
      toast.success("Cuisines saved successfully!");
      return savedCuisines;
    } catch (error) {
      console.log(error);
      toast.error("Failed to save cuisines. Try again later!");
    }
  },
};
