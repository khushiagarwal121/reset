import { Sequelize } from "sequelize";
import databaseConfig from "../../models/index.js";

const { Cuisine, RestaurantCuisine, Restaurant } = databaseConfig.db;

const getAllCuisines = async () => {
  return await Cuisine.findAll({
    attributes: ["uuid", "name"],
  });
};

const getCuisinesByRestaurantUuid = async (restaurant_uuid) => {
  return await RestaurantCuisine.findAll({
    where: { restaurant_uuid },
  });
};

const getCuisinesByCuisineUuids = async (cuisine_uuids) => {
  return await Cuisine.findAll({
    where: {
      uuid: {
        [Sequelize.Op.in]: cuisine_uuids,
      },
    },
  });
};

const addCuisines = async (restaurant_cuisines, transaction) => {
  return await RestaurantCuisine.bulkCreate(restaurant_cuisines, {
    updateOnDuplicate: ["deleted_at", "created_by", "updated_by"], // it only updates the deleted_at field if there is duplicate entry
    transaction,
  });
};

const removeCuisines = async (uuids, restaurant_uuid, transaction) => {
  return await RestaurantCuisine.destroy(
    {
      where: {
        uuid: {
          [Sequelize.Op.in]: uuids,
        },
        restaurant_uuid,
      },
    },
    { transaction }
  );
};

const getRestaurantFromOwnerUuid = async (owner_uuid) => {
  return await Restaurant.findOne({
    where: {
      owner_uuid,
    },
  });
};

export {
  addCuisines,
  getCuisinesByRestaurantUuid,
  getAllCuisines,
  getRestaurantFromOwnerUuid,
  removeCuisines,
  getCuisinesByCuisineUuids,
};
