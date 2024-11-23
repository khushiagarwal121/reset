<template>
  <!-- <v-container class="dashboard"> -->
  <v-container class="d-flex justify-center">
    <DeliveryPartnerSignupForm
      :formData="formData"
      @handleSubmit="submitForm"
    />
  </v-container>
</template>

<script setup>
import { useStore } from "vuex";
import { ref } from "vue";
import { useToast } from "vue-toastification";

// Define reactive properties
const formData = ref({
  vehicle_type: null,
  vehicle_number: null,
  city: null,
  profile_image: null,
  license_number: null,
  license_expiry_date: null,
  license: null,
  document_type: null,
  document_number: null,
  document: null,
});

const store = useStore();
const toast = useToast();

async function submitForm(localFormData) {
  try {
    formData.value = localFormData;

    const user_data = store.getters["auth/getUserForRegistration"];

    const { profile_image, license, document, ...other_details } =
      formData.value;

    const expiray_date = new Date(other_details.license_expiry_date)
      .toISOString()
      .split("T")[0];

    const array_date = expiray_date.split("-");

    other_details.license_expiry_date = `${array_date[2]}-${array_date[1]}-${array_date[0]}`;

    const data = {
      ...user_data,
      other_details,
      document,
      license,
      profile_image,
    };

    const userLogin = {
      email: user_data.email,
      password: user_data.password,
      role: user_data.role_name,
    };

    await store.dispatch("auth/registerUser", data);
    await store.dispatch("auth/loginUser", userLogin);

    toast.success("Delivery Partner Registered Successfully");

    navigateTo("/delivery-partner/dashboard");
  } catch (e) {
    console.log(e);
    toast.error(e.response.data.message);
  }
}
</script>
