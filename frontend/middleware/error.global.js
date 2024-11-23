import { useToast } from "vue-toastification";

// middleware/error-toast.ts
export default defineNuxtRouteMiddleware((to) => {
  const toast = useToast();
  const router = useRouter();

  // Check if error_message exists in query params
  if (to.query.error_message) {
    // Show toast
    toast.error(to.query.error_message, {
      timeout: 5000,
      position: "top-right",
    });

    // Remove error_message from URL without triggering a page reload
    const query = { ...to.query };
    delete query.error_message;
    router.replace(
      {
        path: to.path,
        query,
      },
      { replace: true }
    );
  }
});
