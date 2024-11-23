export default {
  // check if the user is already logged in or not
  isAuthenticated: (state) => !!state.user,

  // Get the full name of the user
  userFullName: (state) => {
    if (!state.user) return ""; // Return empty string if no user
    if (state.user.lastName) {
      return `${state.user.firstName} ${state.user.lastName}`; // Return full name
    }
    return `${state.user.firstName}`; // Return full name
  },

  // Return the user object from state
  user: (state) => state.user, // Access user data

  // Return signup user
  signedUpUser: (state) => state.signedUpUser,

  currentRole: (state) => state.currentRole,

  isCustomer: (state) => {
    return state.currentRole === "Customer";
  },
  isRestaurant_Owner: (state) => {
    return state.currentRole === "Restaurant_Owner";
  },
  isDelivery_PartnerPartner: (state) => {
    return state.currentRole === "Delivery_Partner";
  },

  getUserForRegistration: (state) => {
    return state.signedUpUser;
  },
};
