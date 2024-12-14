import {
  getAllCategories,
  getCategories,
  getDishesByRestaurantUuidAndCategoryUuid,
  deleteDishVariants,
  deleteDish,
} from "./categoryRepository.js";
import { getRestaurantUuidByOwnerUuid } from "../dishes/dishRepository.js";
import databaseConfig from "../../models/index.js";

const { sequelize } = databaseConfig.db;

const fetchAllCategories = async () => {
  return await getAllCategories();
};

const fetchCategories = async (owner_uuid) => {
  const restaurant_uuid = await getRestaurantUuidByOwnerUuid(owner_uuid);

  return await getCategories(restaurant_uuid);
};

const removeRestaurantCategory = async (category_uuid, owner_uuid) => {
  const transaction = await sequelize.transaction();

  try {
    const restaurant_uuid = await getRestaurantUuidByOwnerUuid(owner_uuid);

    const dishes = await getDishesByRestaurantUuidAndCategoryUuid(
      restaurant_uuid,
      category_uuid
    );

    const dishUuids = dishes.map((dish) => dish.uuid);

    await deleteDishVariants(dishUuids, transaction);

    await deleteDish(category_uuid, restaurant_uuid, transaction);

    transaction.commit();

    return {
      message: "Restaurant Category Deleted Successfully!",
    };
  } catch (error) {
    transaction.rollback();
    throw error;
  }
};

export { fetchAllCategories, fetchCategories, removeRestaurantCategory };
