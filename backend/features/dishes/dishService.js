import {
  addDish,
  addDishVariant,
  getDishesByRestaurantUuidAndCategoryUuid,
  getDishVariants,
  getDishImage,
  getDishByDishUuid,
  removeDishVariants,
  getOwnerUuidFromDishUuid,
  getRestaurantUuidByOwnerUuid,
  getCategory,
  updateDishVariantAvailability,
  updateDishVariantAvailabilityByVariant,
  updateDishAvailability,
  updateDishByDishUuid,
  updateInsertDishVariant,
  removeDish,
  removeDishVariant,
  findDishByUuid,
  checkDishBelongsToRestaurant,
} from "./dishRepository.js";
import databaseConfig from "../../models/index.js";
import ApiError from "../../utils/apiError.js";
import fs from "fs";
import path from "path";

const { sequelize } = databaseConfig.db;

const insertDishes = async (dish, dish_image, owner_uuid) => {
  const transaction = await sequelize.transaction();

  try {
    const restaurant_uuid = await getRestaurantUuidByOwnerUuid(owner_uuid);

    if (!restaurant_uuid) {
      throw new ApiError(
        "There is no restaurant found belonging to you !!",
        404
      );
    }

    const new_dish = {
      restaurant_uuid,
      created_by: owner_uuid,
      updated_by: owner_uuid,
      image: dish_image ? dish_image.filename : null,
      ...dish,
    };
    console.log(new_dish);

    const added_dish = await addDish(new_dish, transaction);

    let variants = [];
    if ("variants" in dish) {
      for (let i = 0; i < dish.variants.length; i++) {
        dish.variants[i].dish_uuid = added_dish.uuid;
      }
      variants = await addDishVariant(dish.variants, transaction);
    }

    await transaction.commit();

    return { added_dish, variants };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const fetchDishes = async (owner_uuid, category_uuid) => {
  const restaurant_uuid = await getRestaurantUuidByOwnerUuid(owner_uuid);

  if (!restaurant_uuid) {
    throw new ApiError("You don't have any Restaurant with us !!", 404);
  }

  const fetched_dishes = await getDishesByRestaurantUuidAndCategoryUuid(
    restaurant_uuid,
    category_uuid
  );

  if (!fetched_dishes.length) {
    throw new ApiError(
      `There is no restaurant found associate with ${category_uuid} category uuid !!`,
      404
    );
  }

  return fetched_dishes;
};

// Fetch all variants for a specific dish
const fetchDishVariants = async (dish_uuid) => {
  return await getDishVariants(dish_uuid);
};

// Delete a specific dish after verifying restaurant ownership
const deleteDish = async (dish_uuid, owner_uuid) => {
  const transaction = await sequelize.transaction();

  try {
    const restaurant_uuid = await getRestaurantUuidByOwnerUuid(owner_uuid);

    await removeDishVariants(dish_uuid, transaction);

    await removeDish(dish_uuid, restaurant_uuid, transaction);

    await transaction.commit();
    return;
  } catch (error) {
    await transaction.rollback();
    throw error; // Rethrow error to be handled by the caller
  }
};

// Delete a specific variant of a dish after verifying ownership
const deleteDishVariant = async (owner_uuid, dish_uuid, dish_variant_uuid) => {
  const transaction = await sequelize.transaction();

  try {
    const restaurant_uuid = await getRestaurantUuidByOwnerUuid(owner_uuid);

    const check_restaurant = await checkDishBelongsToRestaurant(
      restaurant_uuid,
      dish_uuid
    ); // Verify dish ownership

    if (!check_restaurant) {
      throw new ApiError("This dish doesn't belongs to you !!", 404);
    }

    await removeDishVariant(dish_variant_uuid, transaction);

    await transaction.commit();
    return;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const changeDishAvailability = async (dish_uuid, is_available) => {
  const transaction = await sequelize.transaction();

  try {
    const dish = await getDishByDishUuid(dish_uuid, transaction);

    if (!dish) {
      throw new ApiError("Dish with the given dish_uuid is not found !!", 404);
    }

    await updateDishVariantAvailability(dish_uuid, is_available, transaction);

    await updateDishAvailability(dish_uuid, is_available, transaction);

    await transaction.commit();

    return;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const changeDishVariantAvailability = async (
  dish_uuid,
  dish_variant_uuid,
  is_available,
  user_uuid
) => {
  const transaction = await sequelize.transaction();

  try {
    const owner = await getOwnerUuidFromDishUuid(dish_uuid);
    if (owner[0].owner_uuid != user_uuid) {
      throw new ApiError("You are not eligible to edit this dish", 400);
    }

    await updateDishVariantAvailabilityByVariant(
      dish_variant_uuid,
      is_available,
      transaction
    );

    await transaction.commit();

    return;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const editDish = async (dish_uuid, dish, user_uuid) => {
  const transaction = await sequelize.transaction();
  try {
    const owner = await getOwnerUuidFromDishUuid(dish_uuid);
    if (owner[0].owner_uuid != user_uuid) {
      throw new ApiError("You are not eligible to edit this dish", 400);
    }

    //get existing dish
    const availabe_dish = await findDishByUuid(dish_uuid, transaction);

    if (!availabe_dish) {
      throw new ApiError("Dish with given id doesn't exist", 400);
    }

    // get dish category
    const category_uuid = await getCategory(dish.category_uuid, transaction);

    if (!category_uuid) {
      throw new ApiError("Provided category doesn't exist", 400);
    }

    dish.details = dish.details ? dish.details : null;
    dish.image = dish.image ? dish.image : null;

    // const dish_image = await getDishImage(dish_uuid, transaction);
    // if(dish_image.image!=dish.image){
    //    throw new ApiError("This provided image does not belong to your dish")
    // }

    const { name, details, is_veg, is_jain, image } = dish;

    //format data for updating
    const edited_dish = {
      name,
      details,
      is_veg,
      is_jain,
      image,
      category_uuid: dish.category_uuid,
      updated_by: user_uuid,
    };

    //DB call for dish update
    const updated_dish = await updateDishByDishUuid(
      dish_uuid,
      edited_dish,
      transaction
    );
    for (let i = 0; i < dish.variants.length; i++) {
      dish.variants[i].dish_uuid = dish_uuid;
    }

    const added_variants = await updateInsertDishVariant(
      dish.variants,
      transaction
    );

    await transaction.commit();
    return { ...updated_dish[1][0].dataValues, variants: added_variants };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export {
  editDish,
  insertDishes,
  deleteDish,
  deleteDishVariant,
  fetchDishes,
  fetchDishVariants,
  changeDishAvailability,
  changeDishVariantAvailability,
};
