export default {
  allCategories: (state) => state.categories,

  allAvailableCategories: (state) => state.availableCategories,

  allAvailableCategoriesName: (state) => {
    const currentCategories = state.categories.map((cat) => cat.name);
    return (state.availableCategories || [])
      .filter((cat) => {
        return !currentCategories.includes(cat.name);
      })
      .map((cat) => cat.name);
  },

  dishesByCategory: (state) => (categoryId) => {
    const category = state.categories.find(
      (category) => category.uuid == categoryId
    );
    return category ? category.dishes : [];
  },
};
