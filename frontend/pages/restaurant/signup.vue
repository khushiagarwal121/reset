<template>
  <v-container fluid>
    <v-row no-gutters>
      <!-- Stepper for displaying current step (visible on medium and up screens) -->
      <v-col sm="4" v-if="$vuetify.display.smAndUp" color="orange-darken-1">
        <restaurantStepperComponent :step="step" />
      </v-col>

      <!-- Form section, changes based on current step -->
      <v-col cols="12" sm="8" color="blue-darken-1">
        <v-card
          :class="$vuetify.display.smAndUp ? 'mt-3 mb-3' : ''"
          :width="$vuetify.display.mdAndUp ? '80%' : '100%'"
        >
          <!-- Step 1: Basic Information -->
          <restaurantFormStep1
            :formData="formData.step1Data"
            v-if="step == 1"
            @nextButtonClicked="handleNext"
          />
          <!-- Step 2: Operating Hours and Images -->
          <restaurantFormStep2
            :formData="formData.step2Data"
            v-if="step == 2"
            @prevButtonClicked="handlePrevious"
            @nextButtonClicked="handleNext"
            @addTimeSlot="addTimeSlot"
          />

          <!-- Step 3: Document Details -->
          <restaurantFormStep3
            :formData="formData.step3Data"
            v-if="step == 3"
            @prevButtonClicked="handlePrevious"
            @submitButtonClicked="handleSubmitForm"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { useToast } from "vue-toastification";

const store = useStore();
const toast = useToast();

// Define reactive properties
const step = ref(1);

// Define form data for each step
const formData = ref({
  step1Data: {
    name: "",
    is_pure_veg: false,
    house_no: "",
    lane_1: "",
    lane_2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    latitude: 23.1935251,
    longitude: 72.5942478,
  },
  step2Data: {
    images: null,
    operating_hour: {
      monday: [{ start_time: "", end_time: "" }],
      tuesday: [{ start_time: "", end_time: "" }],
      wednesday: [{ start_time: "", end_time: "" }],
      thursday: [{ start_time: "", end_time: "" }],
      friday: [{ start_time: "", end_time: "" }],
      saturday: [{ start_time: "", end_time: "" }],
      sunday: [{ start_time: "", end_time: "" }],
    },
    operationalDay: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
  },
  step3Data: {
    fssai_number: "",
    fssai_valid_from: null,
    fssai_valid_to: null,
    gst_number: "",
    pan_number: "",
    fssai_certificate: null,
    gst_certificate: null,
  },
});

// handle navigation
const handleNext = (localFormData) => {
  step.value += 1;
  if (step.value == 2) {
    formData.value.step1Data = localFormData;
  } else if (step.value == 3) {
    formData.value.step2Data = localFormData;
  }
};

const handlePrevious = async (localFormData) => {
  step.value -= 1;

  if (step.value == 2) {
    formData.value.step3Data = localFormData;
  } else {
    localFormData.value.step2Data = localFormData;
  }
};

// Add a new time slot for a specific day
const addTimeSlot = (day) => {
  formData.value.step2Data.operating_hour[day].push({
    start_time: "",
    end_time: "",
  });
};

// Handle form submission on the final step
const handleSubmitForm = async (localFormData) => {
  try {
    formData.value.step3Data = localFormData;

    //format fssai date
    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    formData.value.step3Data.fssai_valid_from = formatDate(
      formData.value.step3Data.fssai_valid_from
    );
    formData.value.step3Data.fssai_valid_to = formatDate(
      formData.value.step3Data.fssai_valid_to
    );

    //adjust operating hour based on operationalDay
    Object.keys(formData.value.step2Data.operationalDay).forEach((key) => {
      if (formData.value.step2Data.operationalDay[key] !== true) {
        formData.value.step2Data.operating_hour[key] = [];
      }
    });

    //format data for submission
    const { operationalDay, images, ...rest2_data } = formData.value.step2Data;
    const { fssai_certificate, gst_certificate, ...rest3_data } =
      formData.value.step3Data;

    const other_details = {
      ...formData.value.step1Data,
      ...rest2_data,
      ...rest3_data,
    };
    const user_data = store.getters["auth/getUserForRegistration"];

    //remove optional field if they are empty
    if (other_details.lane_2 == "") {
      delete other_details.lane_2;
    }
    if (other_details.house_no == "") {
      delete other_details.house_no;
    }

    const data = {
      ...user_data,
      other_details,
      gst_certificate,
      fssai_certificate,
      images,
    };
    const signin_data = {
      email: user_data.email,
      password: user_data.password,
      role: user_data.role_name,
    };

    await store.dispatch("auth/registerUser", data);
    await store.dispatch("auth/loginUser", signin_data);
    toast.success("Signed Up successfully");
    navigateTo("/restaurant/dashboard");
  } catch (e) {
    console.log(e);
    toast.error(e.response.data.message);
  }
};
</script>

<style scoped></style>
