export default {
  SET_AVAILABLE_CATEGORIES(state, allCategories) {
    state.availableCategories = allCategories;
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },
  ADD_CATEGORY(state, category) {
    if (!state.categories) state.categories = [category];
    else state.categories.push(category);
  },
  REMOVE_CATEGORY(state, categoryId) {
    state.categories = state.categories.filter(
      (category) => category.uuid != categoryId
    );
  },
  ADD_DISHES_IN_CATEGORY(state, { category_uuid, dishes }) {
    const category = state.categories.find((cat) => cat.uuid == category_uuid);
    category.showDishes = true;
    category.dishes = dishes;
  },
  ADD_DISH(state, { category_uuid, dish }) {
    const categoryIndex = state.categories.findIndex(
      (cat) => cat.uuid == category_uuid
    );
    if (categoryIndex == -1) {
      const category = state.availableCategories.find(
        (cat) => cat.uuid == category_uuid
      );
      category.dishes = [dish];
      category.showDishes = true;
      category.is_available = true;
      state.categories.push(category);
    } else state.categories[categoryIndex].dishes.push(dish);
  },
  DELETE_DISH(state, { categoryId, dishIndex }) {
    const category = state.categories.find((cat) => cat.uuid == categoryId);
    if (category) {
      category.dishes.splice(dishIndex, 1);
      if (!category.dishes.length) category.showDishes = false;
    } else console.error(`Category with ID ${categoryId} not found.`);
  },
  UPDATE_DISH(state, { categoryId, dishIndex, dishData }) {
    const categoryIndex = state.categories.findIndex(
      (cat) => cat.uuid == categoryId
    );
    if (categoryIndex != -1)
      state.categories[categoryIndex].dishes.splice(dishIndex, 1, dishData);
    else console.error(`Category with ID ${categoryId} not found.`);
  },
  CHANGE_AVAILABILITY(state, { categoryId, dishIndex, is_available }) {
    const category = state.categories.find((cat) => cat.uuid == categoryId);
    if (category) category.dishes[dishIndex].is_available = is_available;
    else console.error(`Category with ID ${categoryId} not found.`);
  },
  CHANGE_SHOW_DISHES(state, { index }) {
    state.categories[index].showDishes = !state.categories[index].showDishes;
  },
};
