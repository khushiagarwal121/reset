<template>
  <!-- The v-dialog component is used to display the forgot password dialog -->
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <!-- The card title displays "Forgot Password" and includes a close button -->
      <v-card-title class="text-h5 text-center pt-4">
        Forgot Password
        <v-btn
          flat
          icon="mdi-close-thick"
          size="small"
          @click="closeDialog"
          class="position-absolute right-0 top-0 mt-4 mr-2"
        ></v-btn>
      </v-card-title>
      <v-card-text class="pt-4">
        <!-- The v-form component is used to handle the forgot password form submission -->
        <v-form @submit.prevent="handleSubmit" ref="form">
          <!-- Email input field -->
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            variant="outlined"
            required
            :rules="emailRules"
            :disabled="loading"
          ></v-text-field>
          <!-- Reset password button -->
          <v-btn
            class="mt-2"
            type="submit"
            color="#E53935"
            block
            :loading="loading"
            :disabled="!isFormValid || loading || waiting"
          >
            Reset Password
          </v-btn>
          <!-- Message showing the timer -->
          <!-- Cooldown text message -->
          <p v-if="waiting" class="remainingTime text-center text-caption mt-2">
            Link sent. Please wait {{ remainingTime }} seconds before sending
            another request.
          </p>
        </v-form>
      </v-card-text>
      <!-- The login link is displayed if the password reset was successful -->
      <v-card-actions
        v-if="resetSuccess"
        class="justify-center pt-0 pb-4 mt-n4"
      >
        <a
          href="#"
          style="text-decoration: none; color: #e53935"
          @click.prevent="redirectToLogin"
        >
          Login
        </a>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
  <script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";

// Emit events to communicate with the parent component
const emit = defineEmits(["switchToLogin", "closeDialog"]);

// Get the Vuex store and toast instance
const store = useStore();
const toast = useToast();

// Reactive data
const dialogVisible = ref(false);
const email = ref("");
const role_name = ref("");
const resetSuccess = ref(false);
const form = ref(null);
const waiting = ref(false); // To track whether the user is in the waiting period
const remainingTime = ref(0); // Remaining time in seconds

// Computed properties
const loading = computed(() => store.state.auth.loading);
const isFormValid = computed(() => {
  const emailValid = emailRules.every((rule) => rule(email.value) === true);
  return emailValid;
});

// Email validation rules
const emailRules = [
  (v) => !!v || "Email is required",
  (v) =>
    /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v) || "Email must be valid",
];

// Methods
const redirectToLogin = () => {
  closeDialog();
  emit("switchToLogin", role_name.value);
};

const openDialog = (role) => {
  dialogVisible.value = true;
  role_name.value = role;
};

const handleSubmit = async () => {
  try {
    // If the user is in the waiting period, prevent form submission
    if (waiting.value) {
      return;
    }
    // Dispatch the "forgotPassword" action in the Vuex store
    await store.dispatch("auth/forgotPassword", email.value);
    resetSuccess.value = true;
    toast.success("Reset password link sent to your email.", {
      autoClose: 2000,
      pauseOnHover: true,
      position: "top-right",
      hideProgressBar: true,
      theme: "colored",
    });

    // Start the 30-second timer
    startCooldown();
  } catch (error) {
    toast.error(error?.message || "An error occurred. Please try again.", {
      autoClose: 3000,
      pauseOnHover: true,
      position: "top-right",
      hideProgressBar: true,
      theme: "colored",
    });
  }
};

const closeDialog = () => {
  email.value = "";
  dialogVisible.value = false;
  emit("closeDialog");
};
// Start a 30-second cooldown timer
const startCooldown = () => {
  waiting.value = true;
  remainingTime.value = 30;
  const interval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value -= 1;
    } else {
      clearInterval(interval);
      waiting.value = false;
    }
  }, 1000);
};
// Expose the openDialog method to the parent component
defineExpose({ openDialog });
</script>
<style scoped>
.remainingTime {
  color: #000000;
}
</style>