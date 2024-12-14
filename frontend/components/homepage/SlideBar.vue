<template>
  <v-sheet width="75%" class="pt-2 pb-2">
    <v-slide-group show-arrows>
      <v-slide-group-item v-for="item in items" :key="item.name">
        <div class="d-flex flex-column justify-center align-center">
          <v-card width="140px" height="140px" class="ml-5 mr-5 rounded-circle">
            <img
              :src="
                item.image
                  ? `http://localhost:8000/uploads/categories/${item.image}`
                  : `/image/${item.name}.png`
              "
              class="image"
            />
          </v-card>
          <p class="text-h6 mt-1">{{ item.name }}</p>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
