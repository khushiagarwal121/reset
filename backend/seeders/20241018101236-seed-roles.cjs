"use strict";


const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert data into the 'roles' table
    return queryInterface.bulkInsert(
      "roles",
      [
        {
          uuid: uuidv4(),
          name: "customer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: uuidv4(),
          name: "admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: uuidv4(),
          name: "delivery_partner",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: uuidv4(),
          name: "restaurant",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
