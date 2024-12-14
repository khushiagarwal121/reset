"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      "Appetizers",
      "Desserts",
      "Beverages",
      "Salads",
      "Soups",
      "Snacks",
      "Seafood",
      "Pasta",
      "Pizza",
      "Roti",
      "Burgers",
      "Sandwiches",
      "Barbecue",
      "Momos",
      "Ice Cream",
      "Pastries",
      "Noodles",
      "Tacos",
      "Sushi",
      "Cheese Platters",
      "Dosa",
      "Idli",
      "Samosa",
      "Chaat",
      "Biryani",
      "Tandoori",
      "Paratha",
      "Paneer Dishes",
      "Spring Rolls",
      "Shakes",
      "Hot Drinks",
      "Brownies",
      "Pav Bhaji",
      "Waffles",
      "Panini",
      "Starters",
      "Vadapav",
      "Chole Bhature",
      "Kebabs",
      "Uttapam",
      "Thali",
    ];

    const categoryData = categories.map((category) => ({
      uuid: uuidv4(),
      name: category,
      image: `${category.replace(/\s+/g, "_")}.jpg`,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("categories", categoryData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
