<template>
  <v-dialog v-model="props.show" max-width="500px">
    <v-card class="rounded-lg">
      <v-card-title class="pa-4 text-white">
        <span class="text-h6">Add Food Category</span>
      </v-card-title>

      <v-card-text class="mt-4">
        <v-autocomplete
          v-model="categoryName"
          :items="categoryOptions"
          label="Category Name"
          variant="outlined"
          :rules="categoryNameRules"
        />
      </v-card-text>

      <v-card-actions class="mt-0 custom-padding">
        <v-btn color="primary" :disabled="disable" @click="addCategory">
          Next
        </v-btn>
        <v-btn color="red" @click="closeDialog"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import requiredValidation from "../../utils/requiredVaidation";

const store = useStore();

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["updateShow", "addCategory"]);

const categoryName = ref(null);
const categoryOptions = computed(
  () => store.getters["menu/allAvailableCategoriesName"]
);
const disable = computed(() => {
  const v = validateCategoryName(categoryName.value);
  return v;
});

// Validation rules for category name
const categoryNameRules = [requiredValidation("Category Name")];

// Close the dialog and emit an event
const closeDialog = () => {
  categoryName.value = null;
  emits("updateShow");
};

// Emit the addCategory event
const addCategory = () => {
  const name = categoryName.value.trim();
  categoryName.value = null;
  emits("addCategory", name);
  closeDialog();
};

const validateCategoryName = (name) => {
  if (!name || !name.trim()) return true;
  return false;
};
</script>

<style scoped>
.v-card-text {
  padding: 0.4rem 1rem 0px !important;
}
.v-card-title {
  background-color: #e53935 !important;
}
.v-btn--slim {
  padding: 0 0 !important;
}
.custom-padding {
  padding-inline: 1rem;
}
</style>
