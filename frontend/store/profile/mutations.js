export default {
  SET_OWNER(state, ownerData) {
    state.owner = { ...ownerData };
    state.originalOwner = { ...ownerData }; // Track original data
  },
  UPDATE_FIELD(state, { key, value }) {
    state.owner[key] = value;
    state.isUpdated =
      JSON.stringify(state.owner) !== JSON.stringify(state.originalOwner);
  },
};
