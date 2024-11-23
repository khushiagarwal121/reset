<template>
  <v-card class="custom-card">
    <v-container>
      <v-form v-model="isValid" class="pl-1">
        <v-container>
          <v-card-title class="pl-0 text-h5">
            Delivery Partner Details
          </v-card-title>

          <v-divider class="border-opacity-25 mb-7 mt-n1"></v-divider>

          <v-row class="mb-2">
            <v-col cols="12">
              <v-select
                label="City *"
                placeholder="Select Your Preferable City"
                :items="cities"
                variant="outlined"
                v-model="localFormData.city"
                :rules="[(v) => !!v || `This is a required field`]"
              />
            </v-col>
          </v-row>

          <p class="sub-heading">Upload Profile Photo</p>
          <v-row>
            <v-col class="d-flex justify-center">
              <v-file-input
                ref="image"
                variant="outlined"
                class="d-none"
                v-model="localFormData.profile_image"
                accept=".jpg,.png"
              />
              <div
                class="file-drag float d-flex flex-column justify-center align-center"
                @click="triggerFileInput('image')"
              >
                <div v-if="localFormData.profile_image">
                  <p class="file-name">
                    {{ localFormData.profile_image.name }}
                  </p>
                </div>
                <div v-else>
                  <v-icon color="blue-darken-2" icon="mdi-tray-arrow-up" />
                  <div v-if="$vuetify.display.smAndUp">
                    <p>Upload Profile Photo Here</p>
                  </div>
                  <p v-else>Upload Here</p>
                  <p>(Format- .jpg or .png)</p>
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Responsive input fields -->
          <v-row class="mb-2">
            <v-col cols="12" md="6">
              <v-text-field
                label="Vehicle Name *"
                placeholder="Enter Vehicle Name"
                :rules="generalRules"
                :maxlength="maxLength"
                variant="outlined"
                v-model="localFormData.vehicle_type"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Vehicle Number *"
                placeholder="e.g., GJ24AF0131"
                :rules="[...generalRules, ...vehicleRules]"
                :maxlength="maxLength"
                variant="outlined"
                v-model="localFormData.vehicle_number"
              />
            </v-col>
          </v-row>

          <v-row class="mb-2">
            <v-col cols="12" md="6">
              <v-text-field
                label="Driving License Number *"
                placeholder="e.g., DL1420110012345"
                :rules="[...generalRules, ...licenseRules]"
                :maxlength="maxLength"
                variant="outlined"
                v-model="localFormData.license_number"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-date-input
                v-model="localFormData.license_expiry_date"
                prepend-icon=""
                variant="outlined"
                label="Driving License Expiry Date *"
                :rules="[(v) => !!v || `This is a required field`]"
              ></v-date-input>
            </v-col>
          </v-row>

          <p class="sub-heading">Upload Driving License *</p>
          <v-row>
            <v-col class="d-flex justify-center">
              <v-file-input
                ref="license"
                variant="outlined"
                class="d-none"
                v-model="localFormData.license"
                accept=".pdf"
                @change="validateFile1"
              />
              <div
                class="file-drag float d-flex flex-column justify-center align-center"
                @click="triggerFileInput('license')"
              >
                <div v-if="localFormData.license">
                  <p class="file-name">{{ localFormData.license.name }}</p>
                </div>
                <div v-else>
                  <v-icon color="blue-darken-2" icon="mdi-tray-arrow-up" />
                  <div v-if="$vuetify.display.smAndUp">
                    <p>Upload License Here</p>
                  </div>
                  <p v-else>Upload Here</p>
                  <p>(Format- .pdf)</p>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row class="mb-2">
            <v-col cols="12" md="6">
              <v-select
                label="Select Document Type *"
                placeholder="Select"
                :items="['PAN Card', 'Aadhar Card']"
                :rules="[(v) => !!v || `This is a required field`]"
                variant="outlined"
                v-model="localFormData.document_type"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :label="`${getLabel(localFormData.document_type)} Number *`"
                :placeholder="hint"
                :rules="[...generalRules, ...documentRules]"
                :maxlength="maxLength"
                variant="outlined"
                v-model="localFormData.document_number"
              />
            </v-col>
          </v-row>

          <p class="sub-heading">
            Upload {{ getLabel(localFormData.document_type) }} *
          </p>
          <v-row>
            <v-col class="d-flex justify-center">
              <v-file-input
                ref="document"
                variant="outlined"
                class="d-none"
                v-model="localFormData.document"
                accept=".pdf"
                @change="validateFile2"
              />
              <div
                class="file-drag float d-flex flex-column justify-center align-center"
                @click="triggerFileInput('document')"
              >
                <div v-if="localFormData.document">
                  <p class="file-name">{{ localFormData.document.name }}</p>
                </div>
                <div v-else>
                  <v-icon color="blue-darken-2" icon="mdi-tray-arrow-up" />
                  <div v-if="$vuetify.display.smAndUp">
                    <p>
                      Upload {{ getLabel(localFormData.document_type) }} Here
                    </p>
                  </div>
                  <p v-else>Upload Here</p>
                  <p>(Format- .pdf)</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- Submit button at bottom, aligned to screen size -->
        <v-container>
          <v-btn
            class="float-right mb-5"
            color="#EF4F5F"
            @click="$emit('handleSubmit', localFormData)"
            :disabled="
              !isValid || !localFormData.license || !localFormData.document
            "
          >
            Submit
          </v-btn>
        </v-container>
      </v-form>
    </v-container>
  </v-card>
</template>

<script setup>
import { VDateInput } from "vuetify/labs/VDateInput";
const emit = defineEmits(["handleSubmit"]);

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
});

const localFormData = reactive({ ...props.formData });
const maxLength = 50;
const isValid = ref(false);
const image = ref(null);
const license = ref(null);
const document = ref(null);
const label = ref(null);
const hint = ref(null);
const no = ref(0);
const regex = ref(null);

const cities = [
  "Gandhinagar",
  "Ahmedabad",
  "Bhavnagar",
  "Vadodara",
  "Jamnagar",
  "Mehsana",
  "Navsari",
  "Rajkot",
  "Patan",
  "Surat",
  "Junagadh",
  "Anand",
  "Nadiad",
  "Morbi",
  "Bharuch",
  "Vapi",
  "Porbandar",
  "Godhra",
  "Veraval",
  "Dahod",
];

const vehicleRules = [
  (v) =>
    (v && /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(v)) || "Invalid Vehicle Number",
  (v) => (v && v.length < 11) || "Vehicle Number must be 10 characters",
];

const licenseRules = [
  (v) => (v && /^[A-Z]{2}\d{13}$/.test(v)) || "Invalid DL Number",
  (v) => (v && v.length < 16) || "DL Number must be 15 characters",
];

const documentRules = [
  (v) => (v && regex.value.test(v)) || `Invalid ${label.value} Number`,
  (v) =>
    (v && v.length < ++no.value) ||
    `${label.value} Number must be ${--no.value} characters`,
];

const generalRules = [
  (v) => !!v || `This is a required field`,
  (v) => v.length < maxLength || `Max ${maxLength} characters allowed`,
];

const triggerFileInput = (inputRef) => {
  if (inputRef == "license") {
    license.value.click();
  } else if (inputRef == "document") {
    document.value.click();
  } else {
    image.value.click();
  }
};

const getLabel = (l) => {
  label.value = l ? `${l}` : "Document";

  if (l === "Aadhar Card") {
    hint.value = "e.g., 325454656756";
    no.value = 12;
    regex.value = /^\d{12}$/;
  }
  if (l === "PAN Card") {
    hint.value = "e.g., GASTK4256U";
    no.value = 10;
    regex.value = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
  }

  return label.value;
};

function validateFile1(event) {
  const file = event.target.files[0];
  const allowedTypes = ["application/pdf"];

  if (file) {
    if (!allowedTypes.includes(file.type)) {
      localFormData.license = null;
      alert("Only PDF files are allowed !");
    }
  }
}

function validateFile2(event) {
  const file = event.target.files[0];
  const allowedTypes = ["application/pdf"];

  if (file) {
    if (!allowedTypes.includes(file.type)) {
      localFormData.document = null;
      alert("Only PDF files are allowed !");
    }
  }
}
</script>

<style scoped>
.file-drag {
  border: 2px dashed #e53935;
  background-color: #f8cac9;
  border-radius: 40px;
  margin: 10px 0 30px;
  padding: 30px 50px;
  width: 20rem;
  height: 7rem;
  text-align: center;
  cursor: pointer;
}

.file-name {
  max-width: 200px; /* Adjust width as needed */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-card {
  width: 90%; /* Default width for larger screens */
  max-width: 600px; /* Adjust as needed */
  margin: 0 auto; /* Center the card */
  transition: all 0.3s ease;
}

@media (max-width: 600px) {
  .custom-card {
    width: 100%; /* Full width on smaller screens */
    height: 100vh; /* Full height on small screens */
    overflow-y: auto; /* Allow scrolling if needed */
  }
}
</style>
