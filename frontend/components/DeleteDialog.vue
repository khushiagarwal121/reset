<template>
  <v-dialog v-model="props.show" max-width="400px">
    <v-card class="rounded-lg">
      <v-card-title class="text-white">Confirm Deletion</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn color="red" text @click="confirm">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(["close", "confirm"]);

const cancel = () => {
  emits("close");
};

const confirm = () => {
  emits("confirm");
};
</script>

<style scoped>
.v-card-title {
  background-color: #e53935 !important;
}

.v-card-text {
  padding: 1rem 1rem 0 !important;
}
</style>
