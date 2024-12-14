import {
  addCuisines,
  getCuisinesByRestaurantUuid,
  getAllCuisines,
  getRestaurantFromOwnerUuid,
  removeCuisines,
  getCuisinesByCuisineUuids,
} from "./cuisineRepository.js";
import { getRestaurantUuidByOwnerUuid } from "../dishes/dishRepository.js";
import databaseConfig from "../../models/index.js";

const { sequelize } = databaseConfig.db;

const fetchAllCuisines = async () => {
  return await getAllCuisines();
};

const fetchCuisines = async (owner_uuid) => {
  const restaurant_uuid = await getRestaurantUuidByOwnerUuid(owner_uuid);

  let fetched_cuisines = await getCuisinesByRestaurantUuid(restaurant_uuid);

  const cuisine_uuids = fetched_cuisines.map((el) => el.cuisine_uuid);

  fetched_cuisines = await getCuisinesByCuisineUuids(cuisine_uuids);

  return fetched_cuisines;
};

const modifyCuisines = async (cuisines, owner_uuid) => {
  const transaction = await sequelize.transaction();

  try {
    const restaurant = await getRestaurantFromOwnerUuid(owner_uuid);

    if (!restaurant) {
      throw new ApiError("No Restaurant found associate with you", 404);
    }

    let restaurant_cuisines = await getCuisinesByRestaurantUuid(
      restaurant.uuid
    );

    let cuisine_uuids = restaurant_cuisines.map((cuisine) => cuisine.uuid);

    await removeCuisines(cuisine_uuids, restaurant.uuid, transaction);

    restaurant_cuisines = cuisines.map((cuisine_uuid) => {
      return {
        restaurant_uuid: restaurant.uuid,
        cuisine_uuid,
        deleted_at: null,
        created_by: owner_uuid,
        updated_by: owner_uuid,
      };
    });

    const added_cuisines = await addCuisines(restaurant_cuisines, transaction);

    cuisine_uuids = added_cuisines.map((el) => el.cuisine_uuid);

    const fetched_cuisines = await getCuisinesByCuisineUuids(cuisine_uuids);

    await transaction.commit();

    return fetched_cuisines;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export { fetchCuisines, fetchAllCuisines, modifyCuisines };
