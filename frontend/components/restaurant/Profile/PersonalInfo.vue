<template>
  <v-sheet class="mx-auto" width="700">
    <v-form @submit.prevent>
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
        label="Email*"
        type="email"
        variant="outlined"
        required
        :rules="emailRules"
      ></v-text-field>

      <!-- Date of Birth of the user -->
      <v-date-input
        class="mt-2"
        v-model="dateOfBirth"
        label="Date of Birth*"
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

      <v-btn class="mt-2" type="submit" block :disabled="isUpdateDisabled"
        >Update</v-btn
      >
    </v-form>
  </v-sheet>
</template>
<script setup>
import { ref, computed } from "vue";
import { VDateInput } from "vuetify/lib/labs/components.mjs";
import { useStore } from "vuex";

const firstName = ref("");
const lastName = ref("");
const countryCode = ref("+91");
const phoneNumber = ref("");
const email = ref("");
const dateOfBirth = ref(null);
const countryCodes = reactive(["+91"]);

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
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
      "Email must be valid",
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

const maxDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});
const clearDate = computed(() => {
  dateOfBirth.value = null;
});

const store = useStore();
const owner = computed(() => store.getters["profile/owner"]);
const isUpdateDisabled = computed(
  () => store.getters["profile/isUpdateDisabled"]
);

// const updateField = (key, value) => {
//   store.commit("owner/UPDATE_FIELD", { key, value });
// };

const updateOwnerDetails = async () => {
  // Handle update API here
};

onMounted(() => {
  store.dispatch("profile/fetchOwnerDetails");
});

watch(owner, (newOwner) => {
  if (newOwner) {
    console.log("owner", owner);
    console.log("new owner", newOwner);
    firstName.value = newOwner.first_name || "";
    lastName.value = newOwner.last_name || "";
    countryCode.value = newOwner.country_code || "+91";
    phoneNumber.value = newOwner.phone_number || "";
    email.value = newOwner.email || "";
    dateOfBirth.value = newOwner.date_of_birth || null;
  }
});
</script>