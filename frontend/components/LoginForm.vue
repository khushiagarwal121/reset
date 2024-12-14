<template>
  <div>
    <!-- Login dialog -->
    <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <!-- Dialog title with close button -->
        <v-card-title class="text-h5 text-center pt-4">
          Login
          <v-btn
            flat
            icon="mdi-close-thick"
            size="small"
            @click="closeDialog"
            class="position-absolute right-0 top-0 mt-4 mr-2"
          ></v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          <!-- Login form -->
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
            <!-- Password input field with toggle for visibility -->
            <v-text-field
              class="mt-2"
              v-model="password"
              label="Password"
              variant="outlined"
              :type="showPassword ? 'text' : 'password'"
              required
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              :rules="passwordRules"
              :disabled="loading"
            ></v-text-field>
            <!-- Forgot password link -->
            <v-card-actions class="justify-end">
              <a
                href="#"
                class="mt-n5 text-subtitle-2"
                style="text-decoration: none; color: #e53935"
                @click.prevent="openForgotPassword(role_name)"
                >Forgot Password?</a
              >
            </v-card-actions>
            <!-- Login button -->
            <v-btn
              class="mt-n4"
              type="submit"
              color="#E53935"
              block
              :loading="loading"
              :disabled="!isFormValid || loading"
            >
              Login
            </v-btn>
          </v-form>
          <!-- Divider to separate login and Google sign-in -->
          <v-divider class="my-4">OR</v-divider>
          <!-- Google sign-in button -->
          <v-btn
            block
            compact
            class="bg-white"
            @click="signInWithGoogle"
            :disabled="loading"
          >
            <img
              src="../assets/googleIcon.svg"
              alt="?"
              width="20"
              height="20"
              class="mr-2"
            />
            Sign in with Google
          </v-btn>
        </v-card-text>
        <!-- Signup link -->
        <v-card-actions class="justify-center pt-0 pb-4 mt-n4">
          New User?
          <a
            href="#"
            style="text-decoration: none; color: #e53935"
            @click.prevent="redirectToSignup"
          >
            Sign Up
          </a>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Forgot password dialog -->
    <ForgotPassword
      ref="forgotPasswordRef"
      @switchToLogin="redirectToLogin"
      :dialogVisible="forgotPasswordDialogVisible"
      @closeDialog="closeForgotPasswordDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import ForgotPassword from "./Forgotpassword.vue";

// Emit events to communicate with parent component
const emit = defineEmits(["switchToSignup"]);

// Get Vuex store and toast instance
const store = useStore();
const toast = useToast();

// Reactive data
const dialogVisible = ref(false);
const showPassword = ref(false);
const forgotPasswordDialogVisible = ref(false);
const forgotPasswordRef = ref(null);
const email = ref("");
const password = ref("");
const role_name = ref("");
const form = ref(null);

// Computed properties
const loading = computed(() => store.state.auth.loading);
// const error = computed(() => store.state.auth.error);

// Email and password validation rules
const emailRules = [
  (v) => !!v || "Email is required",
  (v) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
    "Email must be valid",
];

const passwordRules = [(v) => !!v || "Password is required"];

const isFormValid = computed(() => {
  const emailValid = emailRules.every((rule) => rule(email.value) === true);
  const passwordValid = passwordRules.every(
    (rule) => rule(password.value) === true
  );
  return emailValid && passwordValid;
});

// Methods
const openForgotPassword = (role) => {
  // Close the login dialog and open the forgot password dialog
  dialogVisible.value = false;
  forgotPasswordDialogVisible.value = true;
  role_name.value = role;
  forgotPasswordRef.value.openDialog(role_name.value);
};

const redirectToLogin = (role) => {
  // Close the forgot password dialog and open the login dialog
  forgotPasswordDialogVisible.value = false;
  dialogVisible.value = true;
  role_name.value = role;
};

const closeForgotPasswordDialog = () => {
  // Close the forgot password dialog and open the login dialog
  forgotPasswordDialogVisible.value = false;
  dialogVisible.value = true;
};

const redirectToSignup = () => {
  // Close the login dialog and emit an event to navigate to the signup page
  closeDialog();
  emit("switchToSignup", role_name.value);
};

const openDialog = (role) => {
  // Open the login dialog and set the role_name
  dialogVisible.value = true;
  role_name.value = role;
};

const handleSubmit = async () => {
  // Validate the login form
  if (!form.value) return;
  const { valid } = await form.value.validate();

  // If the form is valid, try to log the user in
  if (valid) {
    try {
      // Dispatch the loginUser action in the Vuex store
      await store.dispatch("auth/loginUser", {
        email: email.value.toLowerCase(),
        password: password.value,
        role: role_name.value,
      });

      // Load the user data from the database
      await store.dispatch("auth/loadUserFromDB");

      // Show a success toast and navigate to the appropriate dashboard
      toast.success("Logged in successfully");
      closeDialog();
      if (role_name.value === "customer") {
        navigateTo("/customer/dashboard");
      } else if (role_name.value === "restaurant") {
        navigateTo("/restaurant/dashboard");
      } else if (role_name.value === "delivery_partner") {
        navigateTo("/delivery-partner/dashboard");
      } else {
        navigateTo("/");
      }
    } catch (error) {
      // Show an error toast if the login fails
      toast.error(error.response?.data?.message || "Login failed");
    }
  }
};

const signInWithGoogle = async () => {
  const { redirect_uri } = await store.dispatch("auth/loginWithGoogleUser", {
    role: role_name.value,
  });

  await navigateTo(redirect_uri, {
    external: true,
  });
};

const closeDialog = () => {
  // Reset the form and close the login dialog
  email.value = "";
  password.value = "";
  dialogVisible.value = false;
  if (form.value) {
    form.value.reset();
  }
};

// Expose the openDialog method to the parent component
defineExpose({ openDialog });
</script>
