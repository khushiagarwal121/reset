import { Model } from "sequelize"; // Import Model and DataTypes from sequelize

export default (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Dish, {
        foreignKey: "category_uuid",
        as: "dishes",
      });
    }
  }

  // Initialize the model
  Category.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
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
      modelName: "Category",
      tableName: "categories",
      paranoid: true, // Enable soft deletes
      createdAt: "created_at", // Set custom column names if needed
      updatedAt: "updated_at", // Set custom column names if needed
      deletedAt: "deleted_at", // Custom name for deletedAt
    }
  );

  return Category;
};
