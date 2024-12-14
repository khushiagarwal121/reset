export default {
  SET_CURRENT_LOCATION(state, location) {
    state.currentLocation = location;
  },
  SET_AUTO_COMPLETE_RESULTS(state, results) {
    state.autoCompleteResults = results;
  },
  SET_AUTO_COMPLETE_DISH_RESULTS(state, results) {
    state.autoCompleteDishResults = results;
  },
  SET_CURRENT_CITY(state, city) {
    state.currentCity = city;
  },
};
