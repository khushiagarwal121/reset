<template>
  <v-app>
    <AppHeader />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import AppHeader from "../components/AppHeader.vue";
</script>
