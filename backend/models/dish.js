import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Dish extends Model {
    static associate(models) {
      Dish.hasMany(models.DishVariant, {
        foreignKey: "dish_uuid",
        as: "variants",
      });
      Dish.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_uuid",
        as: "restaurant",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      Dish.belongsTo(models.Category, {
        foreignKey: "category_uuid",
        as: "category",
      });
    }
  }

  Dish.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      restaurant_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "restaurants",
          key: "uuid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "uuid",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      details: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_veg: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      avg_rating: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_jain: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        type: DataTypes.UUID,
        references: {
          model: "users", // Name of the User table
          key: "uuid", // Primary key in the User table
        },
      },
      updated_by: {
        type: DataTypes.UUID,
        references: {
          model: "users", // Name of the User table
          key: "uuid", // Primary key in the User table
        },
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Dish",
      tableName: "dishes",
      timestamps: true, // Automatically adds createdAt and updatedAt
      createdAt: "created_at", // Custom name for createdAt
      updatedAt: "updated_at", // Custom name for updatedAt
      paranoid: true, // enables soft deletion with deletedAt
      deletedAt: "deleted_at", // custom name for deletedAt
    }
  );

  return Dish;
};
