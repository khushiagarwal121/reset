"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("restaurant_cuisines", {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      restaurant_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "restaurants", // Name of the restaurants table
          key: "uuid", // Primary key in the restaurants table
        },
      },
      cuisine_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "cuisines", // Name of the cuisines table
          key: "uuid", // Primary key in the cuisines table
        },
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: "users", // Name of the restaurants table
          key: "uuid", // Primary key in the restaurants table
        },
        allowNull: true, // Can be null
      },
      updated_by: {
        type: Sequelize.UUID,
        references: {
          model: "users", // Name of the restaurants table
          key: "uuid", // Primary key in the restaurants table
        },
        allowNull: true, // Can be null
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint("restaurant_cuisines", {
      fields: ["restaurant_uuid", "cuisine_uuid"],
      type: "unique",
      name: "unique_restaurant_cuisine", // Custom name for the unique constraint
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("restaurant_cuisines");
  },
};
