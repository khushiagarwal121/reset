import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class RestaurantCuisine extends Model {
    static associate(models) {
      RestaurantCuisine.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_uuid",
      });
      RestaurantCuisine.belongsTo(models.Cuisine, {
        foreignKey: "cuisine_uuid",
      });
      RestaurantCuisine.belongsTo(models.User, {
        foreignKey: "created_by",
        as: "creator", // Alias for the created_by relationship
      });
      RestaurantCuisine.belongsTo(models.User, {
        foreignKey: "updated_by",
        as: "updater", // Alias for the updated_by relationship
      });
    }
  }

  RestaurantCuisine.init(
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
          model: "restaurants", // Name of the User table
          key: "uuid", // Primary key in the User table
        },
      },
      cuisine_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "cuisines", // Name of the cuisine table
          key: "uuid", // Primary key in the Role table
        },
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
      modelName: "RestaurantCuisine",
      tableName: "restaurant_cuisines",
      timestamps: true, // Automatically adds createdAt and updatedAt
      createdAt: "created_at", // Custom name for createdAt
      updatedAt: "updated_at", // Custom name for updatedAt
      paranoid: true, // enables soft deletion with deletedAt
      deletedAt: "deleted_at", // custom name for deletedAt

      // add unique constraint for user_uuid + role_uuid
      indexes: [
        {
          unique: true,
          fields: ["restaurant_uuid", "cuisine_uuid"], // Unique constraint on these fields
        },
      ],
    }
  );
  return RestaurantCuisine;
};
