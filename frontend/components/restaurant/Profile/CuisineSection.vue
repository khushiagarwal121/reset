<template>
  <div>
    <!-- Dropdown for selecting cuisines with rounded corners -->
    <p class="total-cuisines-allowed">Select up to 3 cuisines:</p>
    <v-autocomplete
      v-model="selectedCuisines"
      :items="cuisines"
      item-title="name"
      item-value="uuid"
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
      color="#E53935"
      @click="saveCuisines"
      :disabled="selectedCuisines.length === 0"
    >
      Save
    </v-btn>

    <!-- Display saved cuisines -->
    <div class="saved-cuisines mt-4" v-if="savedCuisineNames?.length > 0">
      <h3>Saved Cuisines:</h3>
      <v-chip
        v-for="(cuisine, index) in savedCuisineNames"
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
export default {
  data() {
    return {
      selectedCuisines: [], // List of selected cuisines
      savedCuisineNames: [], // List of saved cuisines (this will be shown after save)
      cuisines: [], // Fetch cuisine list
    };
  },
  watch: {
    selectedCuisines(newVal) {
      if (newVal.length > 3) {
        this.selectedCuisines.pop(); // Remove the last item if more than 3
      }
    },
  },
  mounted() {
    this.loadCuisines(); // Fetch cuisines when the component is mounted
    this.loadSavedCuisines(); // Fetch saved cuisines when the component is mounted
  },

  methods: {
    // Action to load cuisines when the DOM is rendered
    async loadCuisines() {
      let cuisines = this.$store.getters["cuisine/cuisines"];

      if (cuisines.length === 0) {
        cuisines = await this.$store.dispatch("cuisine/fetchCuisines"); // Fetch cuisines via Vuex action
      }
      this.cuisines = cuisines; // Assign to local data
    },
    // Action to load saved cuisine for particular user
    async loadSavedCuisines() {
      // Get saved cuisines from the Vuex store
      let savedCuisines = this.$store.getters["cuisine/savedCuisines"];
      // If not present in the store, fetch from the backend
      if (savedCuisines.length === 0) {
        savedCuisines = await this.$store.dispatch(
          "cuisine/fetchSavedCuisines"
        );
      }
      // take names of cuisine from savedCuisines
      this.savedCuisineNames = savedCuisines.map((cuisine) => cuisine.name);
    },
    // Action to save selected cuisines
    async saveCuisines() {
      let savedCuisines = await this.$store.dispatch(
        "cuisine/saveCuisines",
        this.selectedCuisines
      );

      if (savedCuisines) {
        // take names of cuisine from savedCuisines
        this.savedCuisineNames = savedCuisines.map((cuisine) => cuisine.name);
      }
      // Clear the selectedCuisines array after saving
      this.selectedCuisines = [];
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
