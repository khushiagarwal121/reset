<template>
  <v-card class="pa-0 w-100">
    <v-simple-table dense class="w-100">
      <thead class="w-100" style="display: block">
        <tr class="table-header">
          <th style="width: 20%">Dish Name</th>
          <th style="width: 20%">Is pure veg?</th>
          <th style="width: 20%">Is jain?</th>
          <th style="width: 20%">Dish Availability</th>
          <th style="width: 20%">Actions</th>
        </tr>
      </thead>
      <tbody class="w-100" style="display: block">
        <tr
          v-for="(dish, dishIndex) in category.dishes"
          :key="dishIndex"
          class="table-row"
        >
          <td style="width: 20%">{{ dish.name }}</td>
          <td style="width: 20%">{{ dish.is_veg ? "Yes" : "No" }}</td>
          <td style="width: 20%">{{ dish.is_jain ? "Yes" : "No" }}</td>
          <td style="width: 20%">
            <!-- Switch Widget -->
            <v-switch
              v-model="dish.is_available"
              hide-details
              class="mr-2"
              color="green"
              track-color="red"
              @change="handleDishAvailabilityChange(dish, dishIndex, category)"
              :ripple="false"
            />
            <!-- Text Widget showing Available/Unavailable -->
            <v-chip v-if="dish.is_available" color="green"> Available </v-chip>
            <v-chip v-else color="red"> Unavailable </v-chip>
          </td>
          <td style="width: 20%">
            <v-tooltip location="bottom" text="Edit dish">
              <template #activator="{ props }">
                <v-btn
                  icon
                  color="blue"
                  @click="editDish(dishIndex, dish, category)"
                  size="small"
                  v-bind="props"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-tooltip location="bottom" text="Delete dish">
              <template #activator="{ props }">
                <v-btn
                  icon
                  color="red"
                  @click="toggleDeleteDialog(dishIndex, dish.uuid, category)"
                  size="small"
                  v-bind="props"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- Confirm Deletion Dialog -->
    <DeleteDialog
      :show="showDeleteDialog"
      :message="deleteMessage"
      @close="toggleDeleteDialog"
      @confirm="handleDeleteDish"
    />

    <!-- Edit Dish Dialog -->
    <MenuDishDialog
      :show="showDishDialog"
      :dishProp="dishToEdit"
      @updateShow="toggleDishDialog"
      @saveDish="handleEditDish"
    />
  </v-card>
</template>

<script setup>
defineProps({
  category: Object,
});

const emits = defineEmits(["editDish", "deleteDish", "dishAvailabilityChange"]);

const showDishDialog = ref(false);
const showDeleteDialog = ref(false);
const dishToRemove = ref(null);
const dishToRemoveIndex = ref(null);
const categoryToRemoveFrom = ref(null);
const dishToEdit = ref(null);
const dishToEditIndex = ref(null);
const categoryToEditFrom = ref(null);
const deleteMessage = ref(null);

const toggleDeleteDialog = (dishIndex, dish_uuid, category) => {
  if (dishIndex >= 0 && category) {
    dishToRemoveIndex.value = dishIndex;
    dishToRemove.value = dish_uuid;
    categoryToRemoveFrom.value = category;
    deleteMessage.value = `Are you sure you want to delete the dish "${category.dishes[dishIndex].name}"?`;
    if (category.dishes.length == 1)
      deleteMessage.value += `It will also delete the category ${category.name} as it has only 1 dish.`;
  } else {
    dishToRemove.value = null;
    categoryToRemoveFrom.value = null;
    deleteMessage.value = null;
  }
  showDeleteDialog.value = !showDeleteDialog.value;
};

const toggleDishDialog = () => {
  showDishDialog.value = false;
};

// Handle dish removal after confirmation
const handleDeleteDish = () => {
  emits(
    "deleteDish",
    dishToRemoveIndex.value,
    dishToRemove.value,
    categoryToRemoveFrom.value
  );
  toggleDeleteDialog(null, null, null);
};

const editDish = (dishIndex, dish, category) => {
  dishToEdit.value = dish;
  dishToEditIndex.value = dishIndex;
  categoryToEditFrom.value = category;
  showDishDialog.value = true;
};

const handleEditDish = (dish) => {
  showDishDialog.value = false;
  const ind = dishToEditIndex.value;
  const cat = categoryToEditFrom.value;
  dishToEdit.value = null;
  dishToEditIndex.value = null;
  categoryToEditFrom.value = null;
  emits("editDish", ind, dish, cat);
};

const handleDishAvailabilityChange = (dish, dishIndex, category) => {
  emits("dishAvailabilityChange", dish, dishIndex, category);
};
</script>

<style scoped>
.v-simple-table {
  table-layout: fixed;
  width: 100% !important;
  border-collapse: collapse;
}

.table-header th {
  text-align: center;
  vertical-align: middle;
  padding: 12px;
  border-bottom: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-row {
  display: flex;
  align-items: center;
}

.table-row:hover {
  background-color: #f9f9f9;
}

td,
th {
  padding: 4px;
  text-align: left;
  vertical-align: middle;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
}

tr {
  display: flex;
}

.v-btn {
  margin: 0 4px !important;
}

.v-btn--size-small {
  --v-btn-height: 20px !important;
}

.v-card-text {
  padding: 1rem 1rem 0px !important;
}

.v-card-title {
  background-color: #e53935 !important;
}

.custom-hover-btn {
  transition: background-color 0.3s, color 0.3s;
}

.custom-hover-btn:hover {
  background-color: #e53935 !important;
  color: white !important;
}
</style>
