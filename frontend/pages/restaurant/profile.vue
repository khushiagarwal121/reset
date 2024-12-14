
<template>
  <v-container class="py-4">
    <v-navigation-drawer permanent>
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          @click="selectMenuItem(index)"
          :active="selectedItem === index"
          active-class="primary"
        >
          <v-list-item-title>
            {{ item }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Content -->
    <v-col cols="9">
      <v-card class="pa-4">
        <!-- Conditionally render components based on the selected menu item -->

        <RestaurantProfilePersonalInfo v-if="selectedItem === 0" />
        <RestaurantProfileCuisineSection v-if="selectedItem === 1" />
      </v-card>
    </v-col>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

// Define menu items
const menuItems = ref([
  "Personal Information",
  "Restaurant Details",
  "Operational Info",
  "Profile Actions",
]);

// Reactive state to track the selected menu item
const selectedItem = ref(0);

// Method to select menu item and show corresponding component
const selectMenuItem = (index) => {
  selectedItem.value = index;
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 250px;
  padding: 20px;
}

.v-list-item {
  margin-bottom: 10px;
  font-size: 28px;
}
</style>