<template>
  <!-- Main container for the sliding carousel -->
  <v-sheet width="75%" class="pt-2 pb-2">
    <v-slide-group>
      <!-- Iterate over the items prop to display each item in the carousel -->
      <v-slide-group-item v-for="item in items" :key="item.title">
        <div class="d-flex flex-column justify-center align-center">
          <v-card width="140px" height="140px" class="ml-5 mr-5 rounded-circle">
            <!-- Dynamically load image based on the item's title -->
            <img :src="`/image/${item.title}.png`" class="image" />
          </v-card>
          <p class="text-h6">{{ item.title }}</p>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
export default {
  props: ["items"],
};
</script>

<style scoped>
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
