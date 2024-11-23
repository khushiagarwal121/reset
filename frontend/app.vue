<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  middleware: ["role"],
});
</script>

<style>
* {
  user-select: none;
}
</style>
