import { useStore } from "vuex";

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useStore(); // Access Vuex store

  // Define allowed routes for each user role
  const roleRoutes = {
    customer: ["/customer/dashboard"],
    restaurant: ["/restaurant/dashboard"],
    delivery_partner: ["/delivery-partner/dashboard"],
  };

  const currentRole = store.state.auth.currentRole; // Get current role from the store

  // Check if the current role has predefined routes
  if (roleRoutes[currentRole]) {
    // Redirect to the first allowed route for the role if the destination path is not allowed
    if (!roleRoutes[currentRole].includes(to.path)) {
      return navigateTo(roleRoutes[currentRole][0]);
    }
  } else {
    // Handle unknown roles by redirecting to the home page
    return navigateTo("/");
  }
});
