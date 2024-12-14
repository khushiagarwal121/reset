import { Model } from "sequelize"; // Import Model and DataTypes from sequelize

export default (sequelize, DataTypes) => {
  class DishVariant extends Model {
    static associate(models) {
      DishVariant.belongsTo(models.Dish, {
        foreignKey: "dish_uuid",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  // Initialize the model
  DishVariant.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
      },
      dish_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "dishes",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "uuid",
        },
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "uuid",
        },
      },
    },
    {
      sequelize, // Pass the Sequelize instance
      modelName: "DishVariant",
      tableName: "dish_variants",
      paranoid: true, // Enable soft deletes
      createdAt: "created_at", // Set custom column names if needed
      updatedAt: "updated_at", // Set custom column names if needed
      deletedAt: "deleted_at", // Custom name for deletedAt
    }
  );

  return DishVariant;
};
