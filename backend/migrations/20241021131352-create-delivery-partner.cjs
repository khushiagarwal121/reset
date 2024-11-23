"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("delivery_partners", {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "uuid",
        },
      },
      average_rating: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      approval_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      delivery_partner_document_uuid: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "delivery_partner_documents",
          key: "uuid",
        },
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("delivery_partners");
  },
};
