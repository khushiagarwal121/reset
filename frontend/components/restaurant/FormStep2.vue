<template>
  <v-form width="auto" v-model="isValid" class="pl-1">
    <!-- Restaurant Timing Section -->
    <v-container>
      <v-card-title class="pl-0 text-h5">Restaurant Timing</v-card-title>
      <v-card-subtitle class="mb-5 pl-0"
        >Set Your Restaurant's Operating Hours</v-card-subtitle
      >
      <v-divider class="mb-4"></v-divider>
      <div
        v-for="(timeslots, day, index) in localFormData.operating_hour"
        :key="index"
        class="mb-4"
      >
        <div class="d-flex justify-space-between timing-div">
          <p class="text-h6 mt-2">{{ day[0].toUpperCase() + day.slice(1) }}</p>
          <!-- checkbox to select restaurant operational status   -->
          <v-checkbox
            color="#E53935"
            class="pt-0"
            label="Operational"
            v-model="localFormData.operationalDay[day]"
          ></v-checkbox>
        </div>
        <div class="d-flex" v-for="(timeslot, ind) in timeslots" :key="ind">
          <v-autocomplete
            :disabled="!localFormData.operationalDay[day]"
            class="mr-2"
            width="30%"
            label="Start Time"
            variant="outlined"
            :items="timeSlots"
            :rules="requiredTimeslotValidation('start time', day, ind)"
            v-model="localFormData.operating_hour[day][ind].start_time"
          ></v-autocomplete>
          <v-autocomplete
            :disabled="!localFormData.operationalDay[day]"
            class="ml-2"
            width="30%"
            label="End Time"
            variant="outlined"
            :items="timeSlots"
            :rules="requiredTimeslotValidation('end time', day, ind)"
            v-model="localFormData.operating_hour[day][ind].end_time"
          ></v-autocomplete>
          <v-icon
            icon="mdi-delete"
            class="ml-2 mt-4 mr-0"
            @click="removeTimeSlot(day, ind)"
          ></v-icon>
        </div>
        <!-- button to add time slot -->
        <v-btn
          class="add-slot pl-0"
          :ripple="false"
          variant="text"
          @click="$emit('addTimeSlot', day)"
          :disabled="
            !localFormData.operationalDay[day] ||
            localFormData.operating_hour[day].length >= 4
          "
        >
          <v-icon icon="mdi-plus" class="ma-0 pa-0"></v-icon>Add more time slot
        </v-btn>
      </div>
    </v-container>
    <v-divider></v-divider>

    <!-- restaurant profile-picture section -->
    <v-container>
      <v-card-title class="pl-0 text-h5"
        >Restaurant Profile Picture</v-card-title
      >
      <v-card-subtitle class="mb-5 pl-0"
        >This will be your restaurant’s profile picture</v-card-subtitle
      >
      <!-- profile_image input -->
      <v-file-input
        ref="profileInput"
        variant="outlined"
        class="d-none ml-0 pl-0"
        accept="image/*"
        v-model="localFormData.images"
        @focus="uploadProfileEvent"
      ></v-file-input>
      <!-- custome file input div -->
      <div class="d-flex justify-center">
        <div
          class="file-drag float d-flex flex-column justify-center align-center"
          @click="onClickFileInput"
        >
          <v-icon color="blue-darken-2" icon="mdi-tray-arrow-up"></v-icon>
          <div v-if="localFormData.images != null">
            <p class="file-name">
              {{ localFormData.images.name }}
            </p>
          </div>
          <div v-else>
            <p>Upload profile picture*</p>
            <p>(Format must be .png,.jpeg or .jpg)</p>
          </div>
        </div>
      </div>
      <p
        class="text-center error-field"
        color="primary"
        ref="errorField"
        :style="{ display: 'none' }"
        v-if="!localFormData.images"
      >
        Profile Photo is a required field
      </p>
    </v-container>
    <!-- navigaton button(prev and next)  -->
    <v-container>
      <v-btn @click="$emit('prevButtonClicked', localFormData)"> Prev </v-btn>
      <v-btn
        class="float-right"
        color="#E53935"
        @click="$emit('nextButtonClicked', localFormData)"
        :disabled="!isValid || !localFormData.images"
      >
        Next
      </v-btn>
    </v-container>
  </v-form>
</template>

<script setup>
import generateTimeSlots from "../../utils/generateTimeSlots";
import { onMounted, defineProps, onBeforeMount, reactive } from "vue";

const emit = defineEmits();

const props = defineProps({
  formData: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

// Local state
let localFormData = ref({ ...props.formData });
let timeSlots = ref([]);
let isValid = ref(false);

//input reference for trigger profile_image upload
const profileInput = ref(null);

const onClickFileInput = () => {
  profileInput.value.click();
};

const removeTimeSlot = (day, ind) => {
  localFormData.value.operating_hour[day].splice(ind, 1);
};

//time slot validation rules:
const requiredTimeslotValidation = (field, day, ind) => {
  if (!localFormData.value.operationalDay[day]) {
    return [];
  }
  const rules = [];

  rules.push((value) => {
    if (value) return true;
    else return `${field} is a required field `;
  });

  if (field == "end time") {
    rules.push((value) => {
      const start = timeToMinutes(
        localFormData.value.operating_hour[day][ind].start_time
      );
      const end = timeToMinutes(
        localFormData.value.operating_hour[day][ind].end_time
      );

      return end > start || "End time must be after start time";
    });
  }

  return rules;
};

//convert time to minute to compare end_time and start_time
const timeToMinutes = (timeSlot) => {
  if (timeSlot == null) return 0;

  const [time, meridiem] = timeSlot.split(" ");
  const [hour, minute] = time.split(":");

  if (meridiem == "AM") {
    return (Number(hour) % 12) * 60 + Number(minute);
  } else {
    return ((Number(hour) % 12) + 12) * 60 + Number(minute);
  }
};

onMounted(() => {
  generateTimeSlots(timeSlots.value); //generate time slots for operating_hour
});
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

.error-field {
  color: red;
}

.timing-div {
  height: 3.5rem;
}
.add-slot {
  color: #42a5f5;
  display: block;
  width: auto;
}
.deActive {
  background-color: red;
}
</style>
