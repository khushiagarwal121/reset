<template>
  <div class="reset-password-page">
    <v-container max-width="600px" class="mx-auto my-12">
      <v-card>
        <!-- Page title -->
        <v-card-title class="text-h5 text-center pt-4">
          Reset Password
        </v-card-title>
        <v-card-text class="pt-4">
          <!-- Expired Token State (Only shown when token is invalid or expired) -->
          <div v-if="resetExpired" class="text-center">
            <div class="d-flex align-center justify-center text-red-600">
              <v-icon color="red" class="mr-2">mdi-alert-circle-outline</v-icon>
              <h3 class="text-h6 mb-0">Invalid or Expired Token</h3>
            </div>
            <p>
              The reset link you followed is either invalid or expired. Please
              try again.
            </p>
            <v-btn @click="redirectToLogin" color="primary" class="mt-4"
              >Back to Login</v-btn
            >
          </div>

          <!-- Reset Password Form (Visible only when token is valid) -->
          <div v-else>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <!-- New Password Input -->
              <v-text-field
                v-model="password"
                label="New Password"
                variant="outlined"
                type="password"
                required
                :rules="passwordRules"
                :disabled="store.getters.loading || resetExpired"
                class="mb-3"
              ></v-text-field>

              <!-- Confirm Password Input -->
              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                required
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :rules="confirmPasswordRules"
                :disabled="store.getters['auth/loading'] || resetExpired"
              ></v-text-field>

              <!-- Reset Password Button -->
              <v-btn
                class="mt-2"
                type="submit"
                color="#E53935"
                block
                :loading="loading"
                :disabled="
                  !isFormValid || store.getters['auth/loading'] || resetExpired
                "
              >
                Reset Password
              </v-btn>
            </v-form>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const resetToken = ref("");
const resetSuccess = ref(false);
const loading = computed(() => store.getters["auth/loading"]);
const resetExpired = ref(false);
const resetError = ref("");
const toast = useToast();
const route = useRoute();
const router = useRouter();
const store = useStore();
const form = ref(null);

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => v.length >= 8 || "Password must be at least 8 characters",
  (v) => /[A-Z]/.test(v) || "Password must contain an uppercase letter",
  (v) => /[a-z]/.test(v) || "Password must contain a lowercase letter",
  (v) => /\d/.test(v) || "Password must contain a number",
  (v) =>
    /[!@#$%&_-]/.test(v) ||
    "Password must contain a special (!,@,#,$,%,&,_,-) character",
];

const confirmPasswordRules = [
  (v) => !!v || "Confirmation is required",
  (v) => v === password.value || "Passwords must match",
];

const isFormValid = computed(() => {
  return (
    passwordRules.every((rule) => rule(password.value) === true) &&
    confirmPasswordRules.every((rule) => rule(confirmPassword.value) === true)
  );
});

onBeforeMount(async () => {
  resetToken.value = route.params.token || "";

  if (!resetToken.value) {
    resetExpired.value = true;

    return;
  }

  try {
    loading.value = true; // Show loading while validating token
    await store.dispatch("auth/validateResetToken", {
      token: resetToken.value,
    });
  } catch (error) {
    if (
      error.message.includes("Password reset token expired") ||
      error.message.includes("Invalid token")
    ) {
      resetExpired.value = true;
      resetError.value = "Token has expired or is invalid.";
    } else {
      toast.error(error.message || "Failed to validate the reset token.");
    }
  }
});

const handleSubmit = async () => {
  if (!resetToken.value) {
    resetError.value = "Reset token is missing. Cannot reset password.";
    return;
  }

  try {
    await store.dispatch("auth/resetPassword", {
      token: resetToken.value,
      password: password.value,
    });
    resetSuccess.value = true;
    toast.success("Password has been reset successfully! Please Login", {
      autoClose: 3000,
      position: "top-right",
    });
    router.push("/"); // Navigate to home after success
  } catch (error) {
    if (error.message.includes("expired password reset token")) {
      resetExpired.value = true;
    } else {
      toast.error(error.message || "An error occurred. Please try again.");
    }
  }
};

const redirectToLogin = () => {
  router.push("/");
};
const handlePasswordChange = () => {
  form.value?.validate();
};
</script>

<style scoped>
.reset-password-page {
  background-color: #f9f9f9;
  min-height: 91vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 20px;
  overflow: hidden;
}
</style>
