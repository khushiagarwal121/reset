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
          <v-text-field
            label="Search here for your favourite food.."
            placeholder=""
            clearable
            variant="solo"
            v-model="searchQuery"
            @click:append-inner="redirectToSearch"
            @keyup.enter="redirectToSearch"
            append-inner-icon="mdi-magnify"
          ></v-text-field>
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

const display = useDisplay();
const searchQuery = ref();
const router = useRouter();

// Computed property for conditional classes
const conditionalClasses = computed(() =>
  display.smAndUp ? "text-h3" : "text-h5"
);

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
