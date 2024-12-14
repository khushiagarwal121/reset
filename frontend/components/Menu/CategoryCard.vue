<template>
  <v-card
    class="d-flex align-center justify-space-between pa-3"
    color="#f5f5f5"
  >
    <!-- Category Name with Arrow -->
    <div @click="toggleDishes" class="d-flex align-center">
      <v-icon class="mr-2">{{
        props.category.showDishes ? "mdi-chevron-down" : "mdi-chevron-right"
      }}</v-icon>
      <span class="text-h6">{{ props.category.name }}</span>
    </div>

    <!-- Buttons: Add Dish & Delete Category -->
    <div class="d-flex align-center">
      <v-btn
        v-model="category.is_available"
        :color="category.is_available ? 'green' : 'grey-darken-2'"
        @click="toggleAvailability"
        :style="{
          '--hover-color': availabilityColor,
        }"
        class="fixed-length font-weight-bold custom-hover-availability-btn"
        variant="outlined"
        :prepend-icon="
          category.is_available
            ? 'mdi-check-circle'
            : 'mdi-close-circle-outline'
        "
      >
        {{ category.is_available ? "Available" : "Unavailable" }}
      </v-btn>
      <v-btn
        color="primary"
        class="ml-2 custom-hover-btn font-weight-bold"
        variant="outlined"
        prepend-icon="mdi-plus"
        @click="openDialog"
      >
        Add Dish
      </v-btn>
      <v-tooltip location="bottom" text="Delete this category">
        <template #activator="{ props }">
          <v-btn
            class="custom-hover-delete-btn font-weight-bold ml-2"
            color="red"
            @click="toggleDeleteDialog"
            variant="outlined"
            prepend-icon="mdi-delete"
            v-bind="props"
          >
            Delete
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <!-- Confirm Deletion Dialog -->
    <DeleteDialog
      :show="showDeleteDialog"
      :message="deleteMessage"
      @close="toggleDeleteDialog"
      @confirm="handleRemoveCategory"
    />
  </v-card>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  category: Object,
});

const showDeleteDialog = ref(false);
const deleteMessage = ref(false);
const availabilityColor = computed(() =>
  props.category.is_available ? "green" : "black"
);
const emits = defineEmits([
  "toggleDishes",
  "deleteCategory",
  "openDishDialog",
  "changeCategoryAvailability",
]);

const toggleDishes = () => {
  emits("toggleDishes");
};

const toggleAvailability = () => {
  emits("changeCategoryAvailability", props.category);
};

const openDialog = () => {
  emits("openDishDialog");
};

const toggleDeleteDialog = () => {
  if (!showDeleteDialog.value)
    deleteMessage.value = `Are you sure you want to delete the Category "${props.category.name}"? It will also delete all the dishes inside that categrory.`;
  else deleteMessage.value = null;
  showDeleteDialog.value = !showDeleteDialog.value;
};

const handleRemoveCategory = () => {
  toggleDeleteDialog();
  emits("deleteCategory", props.category);
};
</script>

<style scoped>
.v-card {
  width: 100%;
}

.custom-hover-btn,
.custom-hover-delete-btn,
.custom-hover-availability-btn {
  transition: background-color 0.3s, color 0.3s;
}

.custom-hover-btn:hover {
  background-color: #007bff !important;
  color: white !important;
}

.custom-hover-delete-btn:hover {
  background-color: #e53935 !important;
  color: white !important;
}

.custom-hover-availability-btn:hover {
  background-color: var(--hover-color) !important;
  color: white !important;
}

.fixed-length {
  min-width: 165px;
}
</style>
