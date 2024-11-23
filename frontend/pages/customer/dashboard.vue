<template>
  <v-container class="dashboard">
    <!-- Displays the user's full name from the store using Vuetify's typography component -->
    <p class="text-h3">Welcome, {{ userFullName }}!</p>
  </v-container>
</template>
  
  <script setup>
import { useStore } from "vuex";

definePageMeta({
  middleware: 'role', // Apply role middleware
});

const store = useStore();

const userFullName = computed(() => store.getters["auth/userFullName"]);
</script>
  
  <style scoped>
</style>