import { useApi } from "~/composables/useApi";

export default {
  fetchAvailableCategories: async ({ getters, commit }) => {
    const { api } = useApi();
    if (
      getters.allAvailableCategories &&
      getters.allAvailableCategories.length > 0
    )
      return;
    try {
      const response = await api.get("/api/v1/categories");
      if (response && response.data && response.data.data)
        commit("SET_AVAILABLE_CATEGORIES", response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  fetchCategoryOfRestaurant: async ({ getters, commit }) => {
    const { api } = useApi();
    if (getters.allCategories && getters.allCategories.length > 0) return;
    try {
      const response = await api.get("api/v1/categories/restaurant");
      if (response && response.data && response.data.data) {
        const categories = response.data.data;
        categories.forEach((cat) => {
          cat.is_available = true;
          cat.showDishes = false;
        });
        commit("SET_CATEGORIES", categories);
      }
    } catch (error) {
      console.error("Error fetching categories of restaurant:", error);
      throw error;
    }
  },

  fetchDishesOfCategory: async (
    { getters, commit },
    { index, category_uuid }
  ) => {
    const { api } = useApi();
    if (getters.allCategories && getters.allCategories[index].dishes) {
      commit("CHANGE_SHOW_DISHES", { index });
      return;
    }
    try {
      const response = await api.get(`api/v1/dishes/${category_uuid}`);
      if (response && response.data && response.data.data) {
        commit("ADD_DISHES_IN_CATEGORY", {
          category_uuid,
          dishes: response.data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  deleteCategory: async ({ commit }, categoryId) => {
    const { api } = useApi();
    try {
      const response = await api.delete(`api/v1/categories/${categoryId}`);

      if (response && response.data && response.data.status == "Success")
        commit("REMOVE_CATEGORY", categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  async addDish({ commit, dispatch }, { category_uuid, dishData, image }) {
    const { formApi } = useApi();
    try {
      const response = await formApi.post("/api/v1/dishes", {
        dish: { category_uuid, ...dishData },
        image,
      });

      if (response && response.data && response.data.data) {
        commit("ADD_DISH", {
          category_uuid,
          dish: {
            ...response.data.data.added_dish,
            variants: response.data.data.variants,
          },
        });
      }
    } catch (error) {
      console.error("Error adding dish:", error);
    }
  },

  async deleteDish({ commit }, { categoryId, dishIndex, dishId }) {
    const { api } = useApi();
    try {
      const response = await api.delete(`/api/v1/dishes/${dishId}`);

      if (response && response.data && response.data.status == "Success")
        commit("DELETE_DISH", { categoryId, dishIndex });
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  },

  async updateDish({ commit }, { categoryId, dishIndex, dish_uuid, dishData }) {
    const { api } = useApi();
    try {
      const response = await api.put(`/api/v1/dishes/edit-dish/${dish_uuid}`, {
        dish: dishData,
      });

      if (response && response.data && response.data.data)
        commit("UPDATE_DISH", {
          categoryId,
          dishIndex,
          dishData: response.data.data,
        });
    } catch (error) {
      console.error("Error updating dish:", error);
    }
  },

  async changeAvailability(
    { commit },
    { categoryId, dishIndex, dishId, is_available }
  ) {
    const { api } = useApi();
    try {
      const response = await api.patch(
        `api/v1/dishes/update-dish-availability`,
        { dish_uuid: dishId, is_available }
      );

      if (response && response.data)
        commit("CHANGE_AVAILABILITY", {
          categoryId,
          dishIndex,
          is_available,
        });
    } catch (error) {
      console.error("Error changing availability:", error);
    }
  },
};
