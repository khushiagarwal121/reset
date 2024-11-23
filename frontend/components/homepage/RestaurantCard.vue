<template>
  <!-- Card container for restaurant information -->
  <v-card variant="text" height="45vh" class="">
    <img :src="`/image/${restaurant.id}.jpg`" class="image" alt="" />
    <div class="text-h5 ml-3">{{ restaurant.name }}</div>
    <div class="text ml-3">
      {{ restaurant.cuisine && restaurant.cuisine.join(", ") }}
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["restaurant"],
};
</script>

<style scoped>
.image {
  width: 100%;
  height: 80%;
  object-fit: cover;
  border-radius: 1rem;
}
</style>
