import { useApi } from "~/composables/useApi";

export default {
  // calling api to get current location from latitude and longitute
  getCurrentLocation: async ({ commit }, { lat, lon }) => {
    const { externalApi } = useApi();

    try {
      const response = await externalApi.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "json", // Request format
            lat, // Latitude
            lon, // Longitude
          },
        }
      );

      const data = response.data;
      const location =
        data.address.city || data.address.town || "Unknown location";
      commit("SET_CURRENT_LOCATION", location);
    } catch (error) {
      console.error("Failed to fetch address:", error.message);
    }
  },
  async fetchDishSuggestions({ commit }, searchQuery) {
    const { api } = useApi();
    try {
      const response = await api.get(
        "/api/v1/restaurants/search/get-suggestions",
        {
          params: {
            search_string: searchQuery,
          },
        }
      );

      const results = response.data.response.map((searchItem) => {
        return {
          name: `${
            searchItem.belongs_to[0].toUpperCase() +
            searchItem.belongs_to.slice(1)
          } - ${searchItem.name}`,
          value: searchItem.uuid,
          category: searchItem.belongs_to,
        };
      });

      commit("SET_AUTO_COMPLETE_DISH_RESULTS", results); // Store the results in Vuex state
    } catch (error) {
      console.error("Error fetching dish suggestions:", error);
    }
  },
  async fetchLocationSuggestions({ commit }, searchQuery) {
    const { externalApi } = useApi();
    try {
      // Use the externalApi instance for the request
      const response = await externalApi.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            format: "json",
            q: searchQuery,
            countrycodes: "in",
            addressdetails: 1,
            limit: 5,
          },
        }
      );

      const results = response.data.map((place) => {
        return {
          name: place.display_name,
          city: place.address?.state_district,
        };
      });
      console.log(results);

      commit("SET_AUTO_COMPLETE_RESULTS", results); // Store the results in Vuex state
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  },
};
