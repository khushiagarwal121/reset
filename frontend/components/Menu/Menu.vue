<template>
  <v-container>
    <div class="custom" v-if="categories.length == 0">
      <v-container class="text-center">
        <v-icon size="100" color="grey lighten-2">mdi-food</v-icon>
        <h3>No Categories Added</h3>
        <p>Add a category to get started with your menu.</p>
        <v-btn
          class="mt-2 font-weight-bold"
          color="#e53935"
          @click="toggleDialog('category', true)"
          >Add Food Category</v-btn
        >
      </v-container>
    </div>

    <!-- Add Category Button -->
    <v-row class="justify-end my-4" v-else>
      <v-btn
        class="font-weight-bold"
        color="#e53935"
        @click="toggleDialog('category', true)"
      >
        Add Food Category
      </v-btn>
    </v-row>

    <!-- Paginated Category List -->
    <v-row
      v-for="(category, index) in paginatedCategories"
      :key="index"
      class="mt-1 px-0"
    >
      <v-col class="px-0 w-100">
        <!-- Category Component -->
        <MenuCategoryCard
          :category="category"
          @toggleDishes="toggleDishes(index)"
          @openDishDialog="toggleDialog('dish', true, category)"
          @deleteCategory="handleDeleteCategory"
          @changeCategoryAvailability="handleAvailabilityOfCategory"
        />

        <!-- Dishes in Category -->
        <MenuDishes
          v-if="category.showDishes"
          :category="category"
          @editDish="handleEditDish"
          @deleteDish="handleDeleteDish"
          @dishAvailabilityChange="handleDishAvailabilityChange"
        />
      </v-col>
    </v-row>

    <!-- Pagination section for Categories -->
    <v-container class="d-flex justify-center pa-0 mt-0 mb-6" v-if="categories.length > 0">
      <v-pagination
        v-model="categoryPage"
        :length="categoriesPageCount"
        rounded="circle"
        :total-visible="5"
        next-icon="mdi-menu-right"
        prev-icon="mdi-menu-left"
        circle
      ></v-pagination> 
    </v-container>

    <!-- Add Category Dialog -->
    <MenuCategoryDialog
      :show="showCategoryDialog"
      :categories="categories"
      @updateShow="toggleDialog('category', false)"
      @addCategory="handleAddCategory"
    />

    <!-- Add Dish Dialog -->
    <MenuDishDialog
      :show="showDishDialog"
      @updateShow="toggleDialog('dish', false)"
      @saveDish="handleAddDish"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";

const toast = useToast();
const store = useStore();

const categories = ref([]);
const showCategoryDialog = ref(false);
const showDishDialog = ref(false);
const selectedCategory = ref(null);
const categoryPage = ref(1);
const categoriesPerPage = ref(5);

// Computed property for paginated categories
const paginatedCategories = computed(() => {
  const start = (categoryPage.value - 1) * categoriesPerPage.value;
  const end = start + categoriesPerPage.value;
  return categories.value.slice(start, end);
});

// Computed property for total categories pages
const categoriesPageCount = computed(() => {
  return Math.ceil(categories.value.length / categoriesPerPage.value);
});

const fetchCategories = async () => {
  try {
    if (
      !store.getters["menu/allCategories"] ||
      store.getters["menu/allCategories"].length == 0
    ) {
      await store.dispatch("menu/fetchCategoryOfRestaurant");
      if (store.getters["menu/allCategories"])
        categories.value = store.getters["menu/allCategories"];
      else toast.error("Failed to load menu. Try again later!");
    } else categories.value = store.getters["menu/allCategories"];
  } catch (error) {
    console.log("Failed to load menu: " + error.response.data.message);
    toast.error("Failed to load menu:" + error.response.data.message);
  }
};

onMounted(() => {
  fetchCategories();
});

const toggleDialog = async (name, isVisible, category) => {
  if (name == "category") {
    if (
      !store.getters["menu/allAvailableCategoriesName"] ||
      store.getters["menu/allAvailableCategoriesName"].length == 0
    ) {
      try {
        await store.dispatch("menu/fetchAvailableCategories");
        if (store.getters["menu/allAvailableCategoriesName"])
          showCategoryDialog.value = isVisible;
        else
          toast.error("Failed to load available categories. Try again later!");
      } catch (error) {
        toast.error(
          "Failed to load available categories:",
          error.response.data.message
        );
      }
    } else showCategoryDialog.value = isVisible;
  } else if (name == "dish") {
    if (isVisible) selectedCategory.value = category;
    showDishDialog.value = isVisible;
  }
};

const toggleDishes = async (index) => {
  const actualIndex = (categoryPage.value - 1) * categoriesPerPage.value + index;
  if (categories.value[actualIndex].showDishes) {
    store.commit("menu/CHANGE_SHOW_DISHES", { index: actualIndex });
    categories.value = store.getters["menu/allCategories"];
  } else {
    await store.dispatch("menu/fetchDishesOfCategory", {
      index: actualIndex,
      category_uuid: categories.value[actualIndex].uuid,
    });
    categories.value = store.getters["menu/allCategories"];
  }
};

const handleAddCategory = (name) => {
  const allAvailableCategories = store.getters["menu/allAvailableCategories"];
  const category = allAvailableCategories.find((cat) => cat.name == name);
  selectedCategory.value = category;
  showCategoryDialog.value = false;
  toggleDialog("dish", true, selectedCategory.value);
};

const handleDeleteCategory = async (category) => {
  const previousLength = store.getters["menu/allCategories"].length;
  if (category.dishes.length == 0) {
    store.commit("menu/REMOVE_CATEGORY", category.uuid);
  } else {
    try {
      await store.dispatch("menu/deleteCategory", category.uuid);
    } catch (error) {
      toast.error("Failed to delete a category:", error.response.data.message);
    }
  }

  if (store.getters["menu/allCategories"].length >= previousLength)
    toast.error("Something went wrong. Please try again later!");
  else {
    categories.value = store.getters["menu/allCategories"];
    delete category.dishes;
    delete category.showDishes;
    toast.success(
      `Category ${category.name} along with its dishes deleted successfully!`
    );
    
    // Reset pagination if needed
    if (categoryPage.value > categoriesPageCount.value) {
      categoryPage.value = categoriesPageCount.value;
    }
  }
};

const handleAddDish = async (dishData) => {
  let image = null;
  if (!dishData.details) delete dishData.details;
  if (dishData.image) image = dishData.image;
  delete dishData.image;
  if (dishData.variants.length == 0) delete dishData.variants;
  await store.dispatch("menu/addDish", {
    category_uuid: selectedCategory.value.uuid,
    dishData,
    image,
  });

  categories.value = store.getters["menu/allCategories"];
  toggleDialog("dish", false);
  toast.success(
    `Dish "${dishData.name}" added to category "${selectedCategory.value.name}"!`
  );
  selectedCategory.value = null;
};

const handleDeleteDish = async (dishIndex, dishId, category) => {
  const name = category.dishes[dishIndex].name;
  await store.dispatch("menu/deleteDish", {
    categoryId: category.uuid,
    dishIndex,
    dishId,
  });
  categories.value = store.getters["menu/allCategories"];
  toast.success(`Dish ${name} deleted from category "${category.name}"!`);
};

const handleEditDish = async (dishIndex, dish, category) => {
  const { name, details, is_veg, is_jain, variants, image } = dish;
  const dishData = { name, details, is_veg, is_jain, variants, image };
  const vars = dishData.variants.map((variant) => {
    const { uuid, name, price, is_default, is_available } = variant;
    variant = { uuid, name, price, is_default, is_available };
    if (!variant.uuid) delete variant.uuid;
    return variant;
  });
  dishData.variants = vars;
  if (!dishData.details) delete dishData.details;
  if (!dishData.image) delete dishData.image;
  dishData.category_uuid = category.uuid;

  await store.dispatch("menu/updateDish", {
    categoryId: category.uuid,
    dishIndex,
    dish_uuid: dish.uuid,
    dishData,
  });
  categories.value = store.getters["menu/allCategories"];
  toast.success(
    `Dish "${dish.name}" in category "${category.name}" is updated.`
  );
};

const handleDishAvailabilityChange = async (dish, dishIndex, category) => {
  await store.dispatch("menu/changeAvailability", {
    categoryId: category.uuid,
    dishIndex,
    dishId: dish.uuid,
    is_available: dish.is_available,
  });
  categories.value = store.getters["menu/allCategories"];
  toast.success(
    `Dish ${dish.name} is now ${
      dish.is_available ? "available" : "not available"
    }`
  );
};
</script>

<style scoped>
@media (min-width: 1280px) {
  .v-container {
    max-width: 1365px;
  }
}
@media (min-width: 1280px) {
  .custom {
    max-width: 1365px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50vh;
    color: #757575;
    border-radius: 8px;
  }
}
</style>