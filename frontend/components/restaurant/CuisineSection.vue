<template>
  <div>
    <!-- Dropdown for selecting cuisines with rounded corners -->
    <p class="total-cuisines-allowed">Select up to 3 cuisines:</p>
    <v-autocomplete
      v-model="selectedCuisines"
      :items="cuisineOptions"
      :rules="[maxSelectionRule]"
      multiple
      clearable
      :menu-props="{ maxHeight: '300px' }"
      class="rounded-md"
      variant="outlined"
    >
    </v-autocomplete>

    <!-- Save Button -->
    <v-btn
      class="mt-4"
      color="red"
      @click="saveSelectedCuisines"
      :disabled="selectedCuisines.length === 0"
    >
      Save
    </v-btn>

    <!-- Display saved cuisines -->
    <div class="saved-cuisines mt-4" v-if="savedCuisines.length > 0">
      <h3>Saved Cuisines:</h3>
      <v-chip
        v-for="(cuisine, index) in savedCuisines"
        :key="index"
        class="ma-2"
        color="default"
        text-color="white"
      >
        {{ cuisine }}
      </v-chip>
    </div>
  </div>
</template>

<script>
import { cuisineOptions } from "@/assets/data/cuisineOptions";
export default {
  data() {
    return {
      selectedCuisines: [], // List of selected cuisines
      savedCuisines: [], // List of saved cuisines (this will be shown after save)
      cuisineOptions, // Imported cuisine list
    };
  },
  watch: {
    selectedCuisines(newVal) {
      if (newVal.length > 3) {
        this.selectedCuisines.pop(); // Remove the last item if more than 3
      }
    },
  },
  methods: {
    // Custom rule to enforce the 3-selection limit
    maxSelectionRule() {
      return this.selectedCuisines.length <= 3 || "Only 3 cuisines allowed!";
    },

    // Save the selected cuisines and update the saved list
    saveSelectedCuisines() {
      this.savedCuisines = [...this.selectedCuisines]; // Save the selected cuisines
      this.selectedCuisines = []; // Clear the selection after saving
    },
  },
};
</script>

<style scoped>
.total-cuisines-allowed {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}
</style>
