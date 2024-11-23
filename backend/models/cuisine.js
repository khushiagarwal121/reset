import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Cuisine extends Model {
    static associate(models) {
      Cuisine.belongsToMany(models.Restaurant, {
        through: models.RestaurantCuisine,
        foreignKey: "cuisine_uuid", // Foreign key in RestaurantCusine tabel
        otherKey: "restaurant_uuid", // Other key in RestaurantCusine tabel
      });
    }
  }
  Cuisine.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Cuisine",
      tableName: "cuisines",
      timestamps: true, // Automatically adds createdAt and updatedAt
      createdAt: "created_at", // Custom name for createdAt
      updatedAt: "updated_at", // Custom name for updatedAt
      paranoid: true, // enables soft deletion with deletedAt
      deletedAt: "deleted_at", // custom name for deletedAt
    }
  );
  return Cuisine;
};
