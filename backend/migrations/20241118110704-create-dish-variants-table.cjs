"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dish_variants", {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4, // Automatically generate a UUID
      },
      unit_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "units",
          key: "uuid",
        },
      },
      dish_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "dishes",
          key: "uuid",
        },
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Items are available by default
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
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "uuid",
        },
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "uuid",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("dish_variants");
  },
};
