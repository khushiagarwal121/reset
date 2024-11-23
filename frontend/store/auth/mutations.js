export default {
  SET_USER(state, user) {
    state.user = user; // Update state with user data
  },
  SET_CURRENT_ROLE(state, role) {
    state.currentRole = role;
  },
  SET_SIGNED_USERDATA(state, userData) {
    state.signedUpUser = userData;
  },

  // Update loading state
  SET_LOADING(state, loading) {
    state.loading = loading; // Set loading status
  },

  // Set error message in state
  SET_ERROR(state, error) {
    state.error = error; // Store error message
  },

  // Clear all user-related data from other states
  CLEAR_USER_DATA(state) {
    state.user = null; // Clear user data
    state.error = null; // Clear error message
    state.loading = false; // Clear loading state
    state.currentRole = null;
    state.signedUpUser = null;
  },
};
