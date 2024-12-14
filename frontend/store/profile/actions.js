import { useApi } from "~/composables/useApi";

export default {
  fetchOwnerDetails: async ({ commit }) => {
    const { api } = useApi();
    try {
      // console.log("fetch owner details");
      const response = await api.get("/api/v1/restaurants/owner-details");
      // console.log("respon", response.data.data);
      commit("SET_OWNER", response.data.data);
    } catch (error) {
      console.error("Error fetching owner details:", error);
    }
  },
};
