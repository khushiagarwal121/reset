<template>
  <v-container
    height="400px"
    width="20%"
    class="stepper d-flex pr-3 flex-column justify-space-between align-space-between ml-10"
  >
    <p class="text-h6 mb-4">Complete Your Registration</p>
    <v-divider class="mb-4" width="90%"></v-divider>
    <p class="1">
      <v-icon
        class="ml-0"
        icon="mdi-circle-medium"
        :color="step >= 1 ? '#E53935' : '#ee7b79'"
        size="34"
      ></v-icon>
      <span> Restaurant Details </span>
    </p>
    <v-divider
      class="ml-4"
      vertical
      :color="step >= 2 ? '#e84f4c' : 'primary'"
      thickness="2"
      length="20px"
    ></v-divider>

    <p class="2">
      <v-icon
        icon="mdi-circle-medium"
        :color="step >= 2 ? '#E53935' : '#ee7b79'"
        size="34"
      ></v-icon>
      <span> Operational Hours </span>
    </p>
    <v-divider
      class="ml-4"
      vertical
      :color="step >= 3 ? '#e84f4c' : 'primary'"
      thickness="2"
    ></v-divider>

    <p class="3">
      <v-icon
        icon="mdi-circle-medium"
        :color="step >= 3 ? '#E53935' : '#ee7b79'"
        size="34"
      ></v-icon>
      <span> Documents </span>
    </p>
  </v-container>
</template>

<
<script setup>
import { defineProps } from "vue";

const props = defineProps({
  step: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.stepper {
  /* background-color: rgba(248, 146, 4, 0.171); */
  border-radius: 1rem;
  position: fixed;
}
.divider {
  height: 600px;
  width: 1.5px;
  background-color: aqua;
  margin-left: 15px;
}
</style>
