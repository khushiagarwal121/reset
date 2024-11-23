import { useStore } from "vuex";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useStore();

  // Try to load user profile data if not already loaded
  if (!store.getters["auth/user"]) {
    await store.dispatch("auth/userProfileData");
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/reset-password/:token",
    "/search",
    "/restaurant/menu-cuisine",
  ];

  // // Allow public routes to proceed without authentication
  if (
    publicRoutes.includes(to.path) ||
    to.path.startsWith("/reset-password/")
  ) {
    return;
  }

  try {
    if (!store.getters["auth/user"] && !store.getters["auth/signedUpUser"]) {
      // No user found, redirect to login
      return navigateTo("/");
    }
    return;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return navigateTo("/");
  }
});
