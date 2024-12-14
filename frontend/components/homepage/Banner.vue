<template>
  <v-container fluid class="ma-0 pa-0" height="auto">
    <!-- Banner image covering the container -->
    <v-img class="position-relative" :src="banner" cover>
      <v-row class="position-relative banner-content" align="start">
        <v-col cols="12" md="6" class="text-section">
          <!-- Heading -->
          <h2 :class="['font-weight-black', 'mb-4', conditionalClasses]">
            Enjoy Your <br />
            Delicious Meal
          </h2>

          <!-- Description paragraph visible on medium and larger screens -->
          <p v-if="$vuetify.display.smAndUp" class="mb-4">
            Indulge in a variety of flavors crafted with the freshest
            ingredients. Whether you're craving a hearty feast or a light bite,
            our menu has something for everyone.
          </p>

          <!-- Search Bar -->
          <v-combobox
            v-model="searchQuery"
            label="Search here for your favourite food.."
            variant="solo"
            clearable
            :items="autoCompleteDishResults"
            @input="debouncedDishFetchSuggestions"
            @click:append-inner="redirectToSearch"
            @keyup.enter="redirectToSearch"
            item-title="name"
            item-value="uuid"
            append-inner-icon="mdi-magnify"
            :open-on-focus="true" 
          />
        </v-col>
      </v-row>
    </v-img>
  </v-container>
</template>

<script setup>
import banner from "@/assets/banner2.jpg";
import { ref, computed } from "vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const display = useDisplay();
const router = useRouter();
const store = useStore();

const searchQuery = ref("");
const autoCompleteDishResults = ref([]);

// Computed property for conditional classes
const conditionalClasses = computed(() =>
  display.smAndUp ? "text-h3" : "text-h5"
);

// Debounced method to fetch dish suggestions
const fetchDishSuggestions = async () => {
  if (searchQuery.value.trim() !== "") {
    await store.dispatch("search/fetchDishSuggestions", searchQuery.value);
    autoCompleteDishResults.value = store.getters["search/getAutoCompleteDishResults"];
  } else {
    autoCompleteDishResults.value = [];
  }
};

// Debounced version of the fetchDishSuggestions function
const debouncedDishFetchSuggestions = useUtils().debounce(fetchDishSuggestions, 500);

// Method to redirect to search page
const redirectToSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: "/search",
      query: { q: searchQuery.value },
    });
  }
};
</script>

<style scoped>
.banner-content {
  height: 100%;
  padding: 10% 5%;
}

.text-section {
  border-radius: 8px;
  padding: 20px;
}
</style>