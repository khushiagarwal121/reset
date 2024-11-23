const { encryptPassword } = useUtils();

import { useToast } from "vue-toastification";
import { useApi } from "~/composables/useApi";

export default {
  loadUserFromDB: async ({ commit, state }, _) => {
    if (state.user) return;
    const { api } = useApi();

    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const response = await api.get("/user/v1/user/details", {
        withCredentials: true,
      });

      const userData = response.data.data.user;

      if (userData) {
        // Create user object with optional lastName
        const userToCommit = {
          firstName: userData.firstName,
          email: userData.email,
          ...(userData.lastName && { lastName: userData.lastName }), // Only include lastName if it exists
        };

        commit("SET_USER", userToCommit);
      }
    } catch (error) {
      commit("SET_ERROR", "Failed to load user data");
    } finally {
      commit("SET_LOADING", false);
    }
  },

  loginUser: async ({ commit }, payload) => {
    const { api } = useApi();

    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      // Encrypt password
      payload.password = encryptPassword(payload.password);

      const response = await api.post("/api/v1/auth/login", payload);

      const userData = response.data.data.user;

      const userToCommit = {
        firstName: userData.first_name,
        email: userData.email,
        ...(userData.last_name && { lastName: userData.last_name }),
      };

      commit("SET_USER", userToCommit);
      commit("SET_CURRENT_ROLE", payload.role);

      return response.data;
    } catch (error) {
      let errorMessage = "Login failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = "Internal server error. Please try again later.";
      }

      commit("SET_ERROR", errorMessage);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  registerUser: async ({ commit }, payload) => {
    const { api, formApi } = useApi();

    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const userToCommit = {
        email: payload.email,
        password: payload.password,
        role_name: payload.role_name,
      };

      // Encrypt password
      payload.password = encryptPassword(payload.password);

      await formApi.post("/api/v1/auth/register", payload);
      // commit("SET_USER", userToCommit);
      // commit("SET_CURRENT_ROLE", userToCommit.role_name);

      return;
    } catch (error) {
      console.log(error);
      let errorMessage = "Login failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = "Internal server error. Please try again later.";
      }

      commit("SET_ERROR", errorMessage);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },

  storeUserData: async ({ commit }, userData) => {
    const userToCommit = {
      firstName: userData.firstName,
      email: userData.email,
      ...(userData.lastName && { lastName: userData.lastName }),
    };
    if (
      userData.role_name === "restaurant" ||
      userData.role_name === "delivery_partner"
    ) {
      commit("SET_SIGNED_USERDATA", userData);
    } else {
      commit("SET_USER", userToCommit);
    }
    commit("SET_CURRENT_ROLE", userData.role_name);
  },

  toggleRole: async ({ commit }, role) => {
    commit("SET_SIGNED_USERDATA", role); // Toggle between roles
  },

  // Request password reset link
  forgotPassword: async (context, email) => {
    const { api } = useApi();
    try {
      context.commit("SET_LOADING", true); // Set loading state
      context.commit("SET_ERROR", null); // Clear previous errors
      // Make POST request to request password reset
      const response = await api.post("/api/v1/auth/forgot-password", {
        email,
      });
      return response.data; // Return response data
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Server error occurred"); // Handle server response error
      } else if (error.request) {
        throw new Error("No response received from server"); // Handle no response error
      } else {
        throw error; // Rethrow the error
      }
    } finally {
      context.commit("SET_LOADING", false); // Reset loading state
    }
  },

  // Reset password action
  resetPassword: async (context, { token, password }) => {
    const { api } = useApi();

    try {
      context.commit("SET_LOADING", true);
      context.commit("SET_ERROR", null);

      // Encrypt the new password before sending it to the backend
      password = encryptPassword(password);

      const response = await api.post(`/api/v1/auth/reset-password/${token}`, {
        password,
      });

      return response.data; // Success message or data
    } catch (error) {
      if (
        error.response?.data?.message ===
        "Invalid or expired password reset token."
      ) {
        throw new Error("Invalid or expired password reset token.");
      }
      throw new Error(error.response?.data?.message || "Server error occurred");
    } finally {
      context.commit("SET_LOADING", false);
    }
  },

  validateResetToken: async (context, { token }) => {
    const { api } = useApi();
    try {
      const response = await api.get(
        `/api/v1/auth/validate-reset-token/${token}`
      );

      // Check if token is valid
      if (response.data.tokenValid) {
        return true; // Token is valid
      } else {
        return false; // Token is not valid
      }
    } catch (error) {
      throw new Error(error.response.data.message || "Validation failed.");
    }
  },

  logoutUser: async (context) => {
    const { api } = useApi();
    const toast = useToast();
    try {
      const response = await api.post("/api/v1/auth/logout");
      toast.success(response.data.message);
      context.commit("CLEAR_USER_DATA");
    } catch (error) {
      console.log(error);
    }
  },
  loginWithGoogleUser: async ({ commit }, payload) => {
    const { api } = useApi();

    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const response = await api.post("/api/v1/auth/google", payload);

      return response.data;
    } catch (error) {
      console.log(error);

      let errorMessage = "Sign in with google failed";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = "Internal server error. Please try again later.";
      }

      commit("SET_ERROR", errorMessage);
      throw error;
    } finally {
      commit("SET_LOADING", false);
    }
  },
  userProfileData: async ({ commit }) => {
    const { api } = useApi();

    try {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      const response = await api.get("/api/v1/auth/user/profile");

      const userData = response.data.data;

      const userToCommit = {
        firstName: userData.user.first_name,
        email: userData.user.email,
        ...(userData.user.last_name && { lastName: userData.user.last_name }),
      };

      commit("SET_USER", userToCommit);
      commit("SET_CURRENT_ROLE", userData.current_role_name);
      commit("SET_LOADING", false);
      commit("SET_SIGNED_USERDATA", null);
      return;
    } catch (error) {
      commit("SET_ERROR", error.message || "An unexpected error occurred");
    } finally {
      commit("SET_LOADING", false);
    }
  },
  updateSignedUserData: async ({ commit }, payload) => {
    commit("SET_SIGNED_USERDATA", payload);
  },
};
