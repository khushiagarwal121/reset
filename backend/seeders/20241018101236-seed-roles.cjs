"use strict";

// const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface) => {
    const roles = ["customer", "admin", "delivery_partner", "restaurant"];

    await queryInterface.bulkInsert(
      "roles",
      [
        {
          uuid: "57a86148-e621-42cf-b8d4-9bb7cef6074c",
          name: "customer",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "2919bf20-77e5-419b-9eed-8f4112719b4c",
          name: "admin",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "c9040807-b84b-47f0-ac6d-a332d5ae7d8c",
          name: "delivery_partner",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "2a22d5b4-fca6-4971-9afc-95901ee0e449",
          name: "restaurant",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
