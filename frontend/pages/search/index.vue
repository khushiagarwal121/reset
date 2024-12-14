<template>
  <div>
    <!-- Search bar section -->
    <v-container class="pa-0 mt-15">
      <v-row class="d-flex justify-center">
        <!-- Location Search -->
        <v-col cols="3" class="pa-0">
          <v-combobox
            v-model="searchLocation"
            label="Search by location"
            variant="solo"
            clearable
            prepend-inner-icon="mdi-map-marker"
            :items="autoCompleteResults"
            @input="debouncedFetchSuggestions()"
            @keydown.enter="selectFirstItem"
            item-title="name"
            item-value="city"
            :open-on-focus="true" 
            no-data-text="No data available"
            :hide-no-data="false"
          />
        </v-col>
        <!-- Name/Dish Search -->
        <v-col cols="5" class="pa-0">
          <v-combobox
            v-model="searchQuery"
            label="Search by restaurant name or dish"
            variant="filled"
            clearable
            :items="autoCompleteDishResults"
            @input="debouncedDishFetchSuggestions()"
            item-title="name"
            item-value="uuid"
            :open-on-focus="true"
            no-data-text="No restaurants or dishes found"
            :hide-no-data="false"
          >
          </v-combobox>
        </v-col>
      </v-row>
    </v-container>

    <!-- Filter section aligned with container -->
    <v-container class="pa-10 pb-4 pl-7">
      <v-row class="d-flex justify-start align-center ml-5">
        <!-- Pure Veg Chip -->
        <v-chip
          class="mx-2"
          @click="selectPureVeg"
          :variant="isPureVeg ? 'elevated' : 'outlined'"
          size="large"
          color="#e53935"
        >
          <template v-if="isPureVeg">
            <v-icon icon="mdi-close" right></v-icon>
          </template>
          Pure Veg
        </v-chip>

        <!-- Jain Chip -->
        <v-chip
          class="mx-2"
          @click="selectJain"
          :variant="isJain ? 'elevated' : 'outlined'"
          size="large"
          color="#e53935"
        >
          <template v-if="isJain">
            <v-icon right>mdi-close</v-icon>
          </template>
          Jain
        </v-chip>

        <!-- Cuisine Filter Chip -->
        <v-chip
          class="mx-2"
          variant="outlined"
          color="#e53935"
          size="large"
          @click="dialog = true"
        >
          Select Cuisines
          <v-icon color="red">mdi-chevron-down</v-icon>
        </v-chip>
      </v-row>
    </v-container>

    <!-- Dialog with Autocomplete -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-lg">
        <v-card-title class="mt-1 ml-2">
          <span class="text-h6">Search by Cuisine</span>
        </v-card-title>
        <v-card-text class="pb-1">
          <v-autocomplete
            v-model="selectedCuisine"
            :items="cuisines"
            item-title="name"
            label="Type to search"
            clearable
            solo
            color="#e53935"
            multiple
            prepend-inner-icon="mdi-food"
          />
        </v-card-text>
        <v-card-actions class="mr-2 mb-1">
          <!-- <v-spacer></v-spacer> -->
          <v-btn text color="primary" @click="dialog = false">Apply</v-btn>
          <v-btn text color="#e53935" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Restaurant section -->
    <v-container fluid class="d-flex flex-wrap justify-center">
      <v-col
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        class="ma-4"
        md="3"
        sm="4"
        cols="12"
      >
        <HomepageRestaurantCard :restaurant="restaurant" />
      </v-col>
    </v-container>

    <!-- Pagination section -->
    <v-container class="d-flex justify-center pa-0 mt-0 mb-6">
      <v-pagination
        v-model="page"
        :length="5"
        rounded="circle"
        :total-visible="5"
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        circle
      ></v-pagination>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchLocation: "",
      searchQuery: "",
      page: 1,
      isPureVeg: false,
      isJain: false,
      dialog: false, // Controls dialog visibility
      cuisines: [], // List of cuisines
      selectedCuisine: [], // Stores selected cuisine
      autoCompleteResults: [],
      autoCompleteDishResults:[],
      restaurants: [
        { id: 1, name: "The Spice House", cuisine: ["North Indian", "Burger"] },
        { id: 2, name: "Green Garden Cafe", cuisine: ["South Indian"] },
        { id: 3, name: "Sunset Grill" },
        { id: 4, name: "The Pasta Place" },
        { id: 5, name: "Grill and Chill" },
        { id: 6, name: "Sushi Corner" },
        { id: 7, name: "The Burger Joint" },
        { id: 8, name: "Farm to Table" },
        { id: 9, name: "Taste of India" },
        { id: 10, name: "Ocean's Catch" },
        { id: 11, name: "BBQ Nation" },
        { id: 12, name: "Pasta Palace" },
      ],
    };
  },
  methods: {
    selectPureVeg() {
      this.isPureVeg = !this.isPureVeg;
    },
    selectJain() {
      this.isJain = !this.isJain;
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          await this.$store.dispatch("search/getCurrentLocation", {
            lat: latitude,
            lon: longitude,
          });
          this.searchLocation = this.$store.getters["search/getLocation"];
        });
        return;
      }
    },
    async fetchLocationSuggestions() {
      if (this.searchLocation.trim() !== "") {
        await this.$store.dispatch(
          "search/fetchLocationSuggestions",
          this.searchLocation
        );
        this.autoCompleteResults = await this.$store.getters[
          "search/getAutoCompleteResults"
        ];
      }
      else{
        this.autoCompleteResults = []
      }
    },
    async fetchDishSuggestions() {
      if (this.searchQuery.trim() !== "") {
        await this.$store.dispatch(
          "search/fetchDishSuggestions",
          this.searchQuery
        );
        this.autoCompleteDishResults = this.$store.getters[
          "search/getAutoCompleteDishResults"
        ];
      }
      else{
        this.autoCompleteDishResults = []
      }
    },
    // Action to load cuisines when the DOM is rendered
    async loadCuisines() {
      let cuisines = await this.$store.getters["cuisine/cuisines"];

      if (cuisines.length === 0) {
        cuisines = await this.$store.dispatch("cuisine/fetchCuisines"); // Fetch cuisines via Vuex action
      }
      this.cuisines = cuisines; // Assign to local data
    },
    selectFirstItem() {
      if (this.autoCompleteResults.length > 0) {
        this.searchLocation = this.autoCompleteResults[0];
      }
    },
  },
  mounted() {
    // Load query params into the searchQuery field
    const route = useRoute();
    this.searchQuery = route.query.q || "";
    this.getLocation(); // get location when app is mounted
    this.loadCuisines(); // get cuisines on app mount
  },
  created() {
    // Wrap fetchLocationSuggestions with debounce
    this.debouncedFetchSuggestions = useUtils().debounce(
      this.fetchLocationSuggestions,
      500
    );
    this.debouncedDishFetchSuggestions = useUtils().debounce(this.fetchDishSuggestions,500)
  },
};
</script>
