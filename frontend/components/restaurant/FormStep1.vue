<template>
  <v-form width="auto" v-model="isValid" class="">
    <!-- Restaurant details container -->
    <v-container class="form-container">
      <v-card-title class="pl-0 text-h5">Restaurant Details</v-card-title>
      <v-card-subtitle class="mb-5 pl-0"
        >Enter restaurant details</v-card-subtitle
      >

      <!-- Restaurant Name Input Field -->
      <v-text-field
        label="Restaurant Name"
        variant="outlined"
        v-model="localFormData.name"
        :rules="[requiredValidation('Restaurant name')]"
      ></v-text-field>
      <!-- Checkbox for pure veg option -->
      <v-checkbox
        label="Is pure veg?"
        v-model="localFormData.is_pure_veg"
      ></v-checkbox>
    </v-container>
    <v-divider></v-divider>

    <!-- Restaurant location container -->
    <v-container>
      <v-card-title class="pl-0 text-h5">Restaurant Location</v-card-title>
      <v-card-subtitle class="mb-5 pl-0"
        >Add your restaurant's location for order pick-up</v-card-subtitle
      >
      <!-- Map to select location -->
      <div id="map" ref="mapComponent"></div>
      <div class="d-flex">
        <!-- Latitude and Longitude fields (auto-filled from map) -->
        <v-text-field
          v-model="localFormData.latitude"
          label="lat"
          variant="outlined"
          class="mr-2 mt-4"
          readonly
        ></v-text-field>
        <v-text-field
          v-model="localFormData.longitude"
          label="lng"
          variant="outlined"
          class="ml-2 mt-4"
          readonly
        ></v-text-field>
      </div>
    </v-container>
    <v-divider></v-divider>

    <!-- Restaurant address container -->
    <v-container>
      <v-card-title class="pl-0 text-h5">Restaurant Address</v-card-title>
      <v-card-subtitle class="mb-5 pl-0"
        >Address details based on the location above</v-card-subtitle
      >
      <!-- Address fields for detailed address input -->
      <div class="form-row">
        <v-text-field
          label="Shop no.(optional)"
          width="40%"
          class="mr-2 form-field"
          variant="outlined"
          v-model="localFormData.house_no"
        ></v-text-field>
      </div>
      <div class="form-row">
        <v-text-field
          class="mr-2 form-field"
          label="Address lane 1*"
          width="50%"
          variant="outlined"
          v-model="localFormData.lane_1"
          :rules="[requiredValidation('Address Line')]"
        ></v-text-field>
        <v-text-field
          class="ml-2 form-field"
          label="Address lane 2(optional)"
          width="50%"
          variant="outlined"
          v-model="localFormData.lane_2"
        ></v-text-field>
      </div>
      <div class="form-row">
        <v-text-field
          class="mr-2 form-field"
          label="Landmark*"
          width="50%"
          variant="outlined"
          v-model="localFormData.landmark"
          :rules="[requiredValidation('Landmark')]"
        ></v-text-field>
        <v-text-field
          class="ml-2 form-field"
          label="pincode*"
          width="50%"
          variant="outlined"
          v-model="localFormData.pincode"
          :rules="pincodeRules"
          @input="handlepincode"
        ></v-text-field>
      </div>
      <div class="form-row">
        <!-- Auto-filled city, state, and country fields based on pincode -->
        <v-text-field
          class="mr-2 form-field"
          label="City*"
          width="50%"
          variant="outlined"
          v-model="localFormData.city"
          :rules="[requiredValidation('City')]"
          readonly
        ></v-text-field>
        <v-text-field
          class="ml-2 form-field"
          label="State*"
          width="50%"
          variant="outlined"
          v-model="localFormData.state"
          :rules="[requiredValidation('State')]"
          readonly
        ></v-text-field>
      </div>
      <v-text-field
        label="Country*"
        variant="outlined"
        v-model="localFormData.country"
        :rules="[requiredValidation('Country')]"
        readonly
      ></v-text-field>
    </v-container>
    <!-- Submit button -->
    <v-container>
      <v-btn
        class="float-right mb-3"
        color="#E53935"
        @click="$emit('nextButtonClicked', localFormData)"
        :disabled="!isValid"
      >
        Next
      </v-btn>
    </v-container>
  </v-form>
</template>

<script setup>
import { Loader } from "@googlemaps/js-api-loader";
import { onMounted, useTemplateRef, defineProps } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const emit = defineEmits();
const toast = useToast();

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
});

let isValid = ref(false);
const map = ref(null);
const mapComponent = ref(null);
let localFormData = ref({ ...props.formData });
let marker = ref(null);


const pincodeRules = [
  (v) => !!v || "Pin code is required",
  (v) => /^[0-9]{6}$/.test(v) || "Pin code must be 6 digits",
];

const requiredValidation = (field) => {
  return (value) => {
    if (value) return true;
    else return `${field} is a required field`;
  };
};

// Initialize Google Map with a draggable marker for location selection
const intializeMap = async () => {
  const loader = new Loader({
    apiKey: "AIzaSyB5A0mJDkhcJGrKxwB65OLtb7-wKWAEU8M",
    version: "weekly",
  });

  await loader.load();

  map.value = await new google.maps.Map(mapComponent.value, {
    center: { lat: 23.1935251, lng: 72.5942478 },
    zoom: 9,
  });

  marker.value = await new google.maps.Marker({
    map: map.value,
    position: map.value.getCenter(),
    draggable: true,
  });

  map.value.addListener("center_changed", () => {
    const center = map.value.getCenter();
    marker.value.setPosition(center); // Move the marker as the map center changes
  });

  map.value.addListener("idle", () => {
    const center = map.value.getCenter();
    localFormData.value.latitude = center.lat(); // Update latitude
    localFormData.value.longitude = center.lng(); // Update longitude
  });
};

// Fetch area details using pincode to auto-fill address fields
const handlepincode = async (e) => {
  if (e.target.value.length == 6) {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${e.target.value}`
    );

    const areaDetails = response.data[0].PostOffice;

    if (areaDetails) {
      localFormData.value.city = areaDetails[0].District;
      localFormData.value.state = areaDetails[0].State;
      localFormData.value.country = areaDetails[0].Country;
    } else {
      localFormData.value.city = "";
      localFormData.value.state = "";
      localFormData.value.country = "";
      toast.error("Please enter valid pincode");
    }
  } else {
    localFormData.value.city = "";
    localFormData.value.state = "";
    localFormData.value.country = "";
  }
};

// Initialize the map on component mount
onMounted(() => {
  intializeMap();
});
</script>

<style scoped>
.form-container {
  width: 100%;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  gap: 16px;
  width: 100%;
  margin-bottom: 16px;
}

.form-field {
  flex: 1;
}

#map {
  height: 45vh;
  width: 100%;
}
</style>
