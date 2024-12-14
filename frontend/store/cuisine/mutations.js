export default {
  SET_SELECTED_CUISINES(state, cuisines) {
    state.selectedCuisines = cuisines;
  },
  SET_SAVED_CUISINES(state, cuisines) {
    state.savedCuisines = cuisines;
  },
  SET_CUISINES(state, cuisines) {
    state.cuisines = cuisines;
  },
  CLEAR_SELECTED_CUISINES(state) {
    state.selectedCuisines = [];
  },
  ADD_SAVED_CUISINES(state, cuisines) {
    state.savedCuisines = cuisines;
  },
};
