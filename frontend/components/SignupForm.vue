<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center pt-4">
        SignUp
        <v-btn
          flat
          icon="mdi-close-thick"
          size="small"
          @click="closeDialog"
          class="position-absolute right-0 top-0 mt-4 mr-2"
        ></v-btn>
      </v-card-title>
      <v-card-text class="pt-6">
        <v-form @submit.prevent="submitForm" ref="form">
          <!-- First and Last name of the user  -->
          <v-row class="px-1 py-0">
            <v-col cols="6" class="px-2 py-0">
              <!-- First name of user -->
              <v-text-field
                v-model="firstName"
                label="First Name*"
                type="text"
                variant="outlined"
                required
                :rules="firstNameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="px-2 py-0">
              <!-- Last name of user not mandatory-->
              <v-text-field
                v-model="lastName"
                label="Last Name"
                type="text"
                variant="outlined"
                :rules="lastNameRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Country Code with Phone number -->
          <v-row class="pt-0">
            <v-col cols="4">
              <v-select
                v-model="countryCode"
                label="Code*"
                variant="outlined"
                required
                :items="countryCodes"
              ></v-select>
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="phoneNumber"
                label="Phone Number*"
                variant="outlined"
                required
                :rules="phoneRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <!-- Email of the user -->
          <v-text-field
            class="mt-2"
            v-model="email"
            label="Email"
            type="email"
            variant="outlined"
            required
            :rules="emailRules"
          ></v-text-field>
          <!-- Password of the user -->
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
          ></v-text-field>
          <!-- Date of Birth of the user -->
          <v-date-input
            class="mt-2"
            v-model="date_of_birth"
            label="Date of Birth"
            variant="outlined"
            required
            prepend-icon=""
            prepend-inner-icon="$calendar"
            :max="maxDate"
            color="primary"
            clearable
            @click:clear="clearDate"
            :rules="dobRules"
          ></v-date-input>
          <!-- Form Submission button -->
          <v-btn
            type="submit"
            color="#E53935"
            block
            :loading="loading"
            :disabled="!isFormValid || loading"
          >
            Create Account
          </v-btn>
        </v-form>
        <v-divider class="my-4" v-if="role_name === 'customer'">OR</v-divider>
        <v-btn
          block
          class="bg-white"
          v-if="role_name === 'customer'"
          @click="signInWithGoogle"
        >
          <img
            src="../assets/googleIcon.svg"
            alt="?"
            width="20"
            height="20"
            class="mr-2"
          />
          Sign up with Google
        </v-btn>
      </v-card-text>
      <!-- Already existing User can login from here as well -->
      <v-card-actions class="justify-center pt-0 pb-4 mt-n4">
        Already User?
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
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { VDateInput } from "vuetify/lib/labs/components.mjs";
import { useToast } from "vue-toastification";

const emit = defineEmits(["switchToSignup"]);

const store = useStore();
const toast = useToast();

const dialogVisible = ref(false);
const showPassword = ref(false);
const firstName = ref("");
const lastName = ref("");
const countryCode = ref("+91");
const phoneNumber = ref("");
const email = ref("");
const password = ref("");
const date_of_birth = ref(null);
const countryCodes = reactive(["+91"]);
const role_name = ref("");
const form = ref(null);

// const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);
// const user = computed(() => store.getters["auth/user"]);
const loading = computed(() => store.state.auth.loading);

// All the rules regarding every field is defined below

const firstNameRules = computed(() => {
  return [
    (v) => !!v || "First name is required",
    (v) => v.length <= 30 || "First Name must not exceed 30 characters",
    (v) =>
      (v && /^[A-Za-z]+$/.test(v)) ||
      "First name should only contain alphabates",
  ];
});
const lastNameRules = computed(() => {
  return [
    (v) =>
      !v ||
      (v.length <= 30 && /^[A-Za-z]+$/.test(v)) || // Check length and alphabets
      "Last name must be alphabetic and up to 30 characters.",
  ];
});
const phoneRules = computed(() => {
  return [
    (v) => !!v || "Phone number is required",
    (v) => /^\d+$/.test(v) || "Phone number must only contain digits",
    (v) => v.length == 10 || "Phone number must be at 10 digits long",
  ];
});
const emailRules = computed(() => {
  return [
    (v) => !!v || "Email is required",
    (v) =>
      /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v) || "Email must be valid",
  ];
});
const passwordRules = computed(() => {
  return [
    (v) => !!v || "Password is required",
    (v) => v.length >= 8 || "Password must be at least 8 characters",
    (v) => /[A-Z]/.test(v) || "Password must contain an uppercase letter",
    (v) => /[a-z]/.test(v) || "Password must contain a lowercase letter",
    (v) => /\d/.test(v) || "Password must contain a number",
    (v) =>
      /[@$!%*?&#_-]/.test(v) ||
      "Password must contain a special (@,$,!,%,*,?,&,#,_,-) character",
    (v) => !/\s/.test(v) || "Password cannot contain spaces",
  ];
});
const dobRules = computed(() => {
  return [
    (v) => !!v || "Date of Birth is required",
    (v) => {
      const birthDate = new Date(v);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= 16 || "You must be at least 16 years old";
    },
  ];
});

const isFormValid = computed(() => {
  const firstNameValid = firstNameRules.value.every(
    (rule) => rule(firstName.value) === true
  );
  const lastNameValid = lastNameRules.value.every(
    (rule) => rule(lastName.value) === true
  );
  const phoneValid = phoneRules.value.every(
    (rule) => rule(phoneNumber.value) === true
  );
  const emailValid = emailRules.value.every(
    (rule) => rule(email.value) === true
  );
  const passwordValid = passwordRules.value.every(
    (rule) => rule(password.value) === true
  );
  const dobValid = dobRules.value.every(
    (rule) => rule(date_of_birth.value) === true
  );

  return (
    firstNameValid &&
    lastNameValid &&
    phoneValid &&
    emailValid &&
    passwordValid &&
    dobValid
  );
});

const maxDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});
const clearDate = computed(() => {
  date_of_birth.value = null;
});

// All the methods are written here which will be work when the required event trigger

const redirectToLogin = () => {
  closeDialog();
  emit("switchToLogin", role_name.value);
};

const openDialog = (role) => {
  dialogVisible.value = true;
  role_name.value = role;
};

const submitForm = async () => {
  const formattedDob = date_of_birth.value
    ? new Date(date_of_birth.value).toISOString().split("T")[0]
    : null;

  try {
    const userData = {
      first_name: firstName.value,
      email: email.value,
      country_code: countryCode.value,
      phone_number: phoneNumber.value,
      password: password.value,
      date_of_birth: formattedDob,
      role_name: role_name.value,
      ...(lastName.value && { last_name: lastName.value }),
    };

    if (role_name.value === "customer") {
      await store.dispatch("auth/registerUser", userData);
      await store.dispatch("auth/loginUser", {
        email: email.value,
        password: password.value,
        role: role_name.value,
      });
      // await store.dispatch("auth/loadUserFromDB");
      toast.success("Signed Up successfully");
      closeDialog();
      navigateTo("/customer/dashboard");
    } else if (role_name.value === "restaurant") {
      await store.dispatch("auth/storeUserData", userData);
      closeDialog();
      navigateTo("/restaurant/signup");
    } else if (role_name.value === "delivery_partner") {
      await store.dispatch("auth/storeUserData", userData);

      closeDialog();
      navigateTo("/delivery-partner/signup");
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Signing in failed");
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
  firstName.value = "";
  lastName.value = "";
  phoneNumber.value = "";
  email.value = "";
  password.value = "";
  date_of_birth.value = null;
  dialogVisible.value = false;
};

// Expose the openDialog method to the parent component
defineExpose({ openDialog });
</script>
