<template>
  <v-form width="auto" v-model="isValid" class="pl-1">
    <!-- Restaurant Document Section -->

    <div class="pl-5 pr-3">
      <v-card-title class="pl-0 text-h4"
        >Upload Restaurant Documents</v-card-title
      >
      <v-card-subtitle class="mb-5 pl-0"
        >Upload required documents</v-card-subtitle
      >
      <v-divider></v-divider>

      <!-- fssai section -->
      <v-card-title class="pl-0 text-h5">FSSAI Details</v-card-title>
      <v-text-field
        label="FSSAI Number*"
        variant="outlined"
        v-model="localFormData.fssai_number"
        :rules="[fssaiValidation]"
      ></v-text-field>

      <!-- fssai valid_from date input -->
      <div class="d-flex">
        <v-date-input
          v-model="localFormData.fssai_valid_from"
          class="mr-2"
          prepend-icon=""
          width="autp"
          variant="outlined"
          label="FSSAI Valid From*"
          :rules="requiredValidation('FSSAI Valid From')"
          :min="
            new Date(new Date().setFullYear(new Date().getFullYear() - 6))
              .toISOString()
              .split('T')[0]
          "
          :max="new Date().toISOString().split('T')[0]"
        ></v-date-input>
        <!-- fssai valid_to date input  -->
        <v-date-input
          v-model="localFormData.fssai_valid_to"
          width="auto"
          class="ml-2"
          prepend-icon=""
          variant="outlined"
          label="FSSAI Valid To*"
          :rules="requiredValidation('FSSAI Valid To')"
          :min="new Date().toISOString().split('T')[0]"
          :max="
            new Date(new Date().setFullYear(new Date().getFullYear() + 6))
              .toISOString()
              .split('T')[0]
          "
        ></v-date-input>
      </div>
      <p class="sub-heading">Upload FSSAI Certificate*</p>
      <!-- fssai certificate input field  -->
      <v-file-input
        ref="fssai"
        variant="outlined"
        class="d-none ml-0 pl-0"
        v-model="localFormData.fssai_certificate"
        :rules="[requiredValidation('FSSAI Certificate')]"
        accept=".pdf,.doc"
      ></v-file-input>
      <div class="d-flex justify-center">
        <div
          class="file-drag float d-flex flex-column justify-center align-center"
          @click="triggerFileInput('fssai')"
        >
          <v-icon color="blue-darken-2" icon="mdi-tray-arrow-up"></v-icon>
          <div v-if="localFormData.fssai_certificate != null">
            <p class="file-name">
              {{ localFormData.fssai_certificate.name }}
            </p>
          </div>
          <div v-else>
            <p color="amber darken-3">Upload FSSAI Certificate</p>
            <p>(Format must be .PDF or .Doc)</p>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <!-- Gst section -->
      <v-card-title class="pl-0 text-h5">GST Details</v-card-title>

      <v-text-field
        label="GST Number*"
        v-model="localFormData.gst_number"
        variant="outlined"
        :rules="[gstValidation]"
        @input="
          () =>
            (localFormData.gst_number = localFormData.gst_number.toUpperCase())
        "
      ></v-text-field>
      <p class="sub-heading">Upload GST Certificate*</p>
      <v-file-input
        ref="gst"
        variant="outlined"
        class="d-none ml-0 pl-0"
        :rules="requiredValidation('GST Certificate')"
        v-model="localFormData.gst_certificate"
        accept=".pdf,.doc"
      ></v-file-input>
      <div class="d-flex justify-center">
        <div
          class="file-drag float d-flex flex-column justify-center align-center"
          @click="triggerFileInput('gst')"
        >
          <v-icon color="blue-darken-2" icon="mdi-tray-arrow-up"></v-icon>
          <div v-if="localFormData.gst_certificate != null">
            <p class="file-name">
              {{ localFormData.gst_certificate.name }}
            </p>
          </div>
          <div v-else>
            <p color="amber darken-3">Upload GST Certificate</p>
            <p>(Format must be .PDF or .Doc)</p>
          </div>
        </div>
      </div>
      <v-divider></v-divider>

      <!-- Pan details section -->
      <v-card-title class="pl-0 text-h5 mb-3">PAN Details</v-card-title>
      <v-text-field
        label="Pan Number*"
        variant="outlined"
        v-model="localFormData.pan_number"
        :rules="[panValidation]"
        @input="
          () =>
            (localFormData.pan_number = localFormData.pan_number.toUpperCase())
        "
      ></v-text-field>

      <!-- navigation -->
      <div class="mb-3">
        <v-btn @click="$emit('prevButtonClicked', localFormData)"> Prev </v-btn>
        <v-btn
          class="float-right"
          color="#E53935"
          @click="$emit('submitButtonClicked', localFormData)"
          :disabled="
            !isValid ||
            !localFormData.gst_certificate ||
            !localFormData.fssai_certificate
          "
        >
          Submit
        </v-btn>
      </div>
    </div>
  </v-form>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { VDateInput } from "vuetify/labs/VDateInput";

// Define props
const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
});

// Define emits
const emit = defineEmits();

// Local state
const localFormData = ref({ ...props.formData });
const isValid = ref(false);

//input reference for trigger file upload
const fssai = ref(null);
const gst = ref(null);

function triggerFileInput(inputType) {
  inputType === "fssai" ? fssai.value.click() : gst.value.click();
}

//validations:
function fssaiValidation(value) {
  const fssaiRegex = /^\d{14}$/;
  if (!value) {
    return "FSSAI number is required";
  } else if (!fssaiRegex.test(value)) {
    return "Invalid FSSAI number. Must be 14 digits.";
  }
  return true;
}

function gstValidation(value) {
  const gstRegex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
  if (!value) {
    return "GST number is required";
  } else if (!gstRegex.test(value)) {
    return "Invalid GST number. It must follow the format 22AAAAA0000A1Z5";
  }
  return true;
}

function panValidation(value) {
  const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
  if (!value) {
    return "PAN number is required";
  } else if (!panRegex.test(value)) {
    return "Invalid PAN number. It must follow the format AAAAA1234A.";
  }
  return true;
}

function requiredValidation(field) {
  const rules = [];

  rules.push((value) => {
    if (value) return true;
    else return `${field} is a required field `;
  });

  if (field == "FSSAI Valid To") {
    rules.push((value) => {
      const start = localFormData.value.fssai_valid_from;

      const end = localFormData.value.fssai_valid_to;

      return end > start || "Valid To must be after Valid From";
    });
  }
  return rules;
}
</script>

<style scoped>
.file-drag {
  border: 2px dashed #e53935;
  background-color: #f8cac9;
  border-radius: 40px;
  margin: 10px 0 15px;
  padding: 30px 50px;
  width: 300px;
  height: 150px;
  text-align: center;
  cursor: pointer;
}

.file-name {
  max-width: 200px; /* Adjust width as needed */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.timing-div {
  height: 3.5rem;
}

.heading {
  font-size: 1.5rem;
}

.sub-heading {
  font-size: 1.2rem;
}
</style>
