export const mutations = {
  SET_SELECTED_CUISINES(state, cuisines) {
    state.selectedCuisines = cuisines;
  },
  SET_SAVED_CUISINES(state, cuisines) {
    state.savedCuisines = cuisines;
  },
  CLEAR_SELECTED_CUISINES(state) {
    state.selectedCuisines = [];
  },
};
