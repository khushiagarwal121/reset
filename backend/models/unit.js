import { Model } from "sequelize"; // Import Model and DataTypes from sequelize

export default (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {
      Unit.belongsToMany(models.Dish, {
        through: models.DishVariant,
        foreignKey: "unit_uuid", // Foreign key in DishRestaurant
        otherKey: "dish_uuid", // Other key in DishRestaurant
      });
    }
  }

  // Initialize the model
  Unit.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
      },
      unit_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2), // Decimal with precision 10 and scale 2
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "uuid", // Primary key in the restaurant table
        },
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "uuid", // Primary key in the restaurant table
        },
      },
    },
    {
      sequelize, // Pass the Sequelize instance
      modelName: "Unit",
      tableName: "units",
      paranoid: true, // Enable soft deletes
      createdAt: "created_at", // Set custom column names if needed
      updatedAt: "updated_at", // Set custom column names if needed
      deletedAt: "deleted_at", // Custom name for deletedAt
    }
  );

  return Unit;
};
