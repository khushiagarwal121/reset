"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("dishes", {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      restaurant_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "restaurants", // References the 'restaurants' table
          key: "uuid", // Refers to the 'uuid' column in the 'restaurants' table
        },
        onUpdate: "CASCADE", // Updates if the parent record changes
        onDelete: "CASCADE", // Deletes this record if the parent record is deleted
      },
      category_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "categories", // References the 'categories' table
          key: "uuid", // Refers to the 'uuid' column in the 'categories' table
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL", // Sets this column to NULL if the parent record is deleted
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      details: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_veg: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      avg_rating: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_jain: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: Sequelize.UUID,
        references: {
          model: "users", // Name of the User table
          key: "uuid", // Primary key in the User table
        },
      },
      updated_by: {
        type: Sequelize.UUID,
        references: {
          model: "users", // Name of the User table
          key: "uuid", // Primary key in the User table
        },
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("dishes");
  },
};
