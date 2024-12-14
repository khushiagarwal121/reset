import databaseConfig from "../../models/index.js";

const { Restaurant, Category, Dish, DishVariant } = databaseConfig.db;

// Retrieve restaurant UUID based on the owner's UUID
const getRestaurantUuidByOwnerUuid = async (owner_uuid) => {
  const restaurant = await Restaurant.findOne({
    where: { owner_uuid },
    attributes: ["uuid"],
  });

  return restaurant ? restaurant.uuid : null;
};

const getCategory = async (uuid, transaction) => {
  const category = await Category.findOne(
    {
      where: { uuid },
      attributes: ["uuid"],
    },
    { transaction }
  );

  return category ? category.uuid : null; // Return UUID or null if not found
};

// Check if a dish belongs to a specific restaurant
const checkDishBelongsToRestaurant = async (restaurant_uuid, uuid) => {
  const check_valid_restaurant = await Dish.findOne({
    where: {
      uuid,
      restaurant_uuid,
    },
  });
  return check_valid_restaurant ? true : false;
};

const addDish = async (dish, transaction) => {
  return await Dish.create(dish, { transaction });
};

const updateInsertDishVariant = async (variants, transaction) => {
  return await DishVariant.bulkCreate(variants, {
    updateOnDuplicate: [
      "uuid",
      "name",
      "quantity",
      "price",
      "is_available",
      "is_default",
    ], // Fields to update on conflict
    fields: [
      "uuid",
      "dish_uuid",
      "name",
      "quantity",
      "price",
      "is_available",
      "is_default",
    ], // Include all necessary fields
    conflictFields: ["uuid"], // Use `uuid` to detect conflicts
    returning: true, // Return updated rows
    transaction,
  });
};

const addDishVariant = async (variants, transaction) => {
  return await DishVariant.bulkCreate(variants, { transaction });
};

// Fetch all dishes for a specific restaurant with their respective category and variants
const getDishesByRestaurantUuidAndCategoryUuid = async (
  restaurant_uuid,
  category_uuid
) => {
  return await Dish.findAll({
    include: [
      // {
      //   model: Category,
      //   as: "category",
      //   attributes: ["uuid", "name"],
      // },
      {
        model: DishVariant,
        as: "variants",
      },
    ],
    where: {
      restaurant_uuid,
      category_uuid,
    },
  });
};

// Fetch all variants of a specific dish
const getDishVariants = async (dish_uuid) => {
  return await DishVariant.findAll({
    where: {
      dish_uuid,
    },
  });
};

const getDishByDishUuid = async (uuid, transaction) => {
  return await Dish.findOne(
    {
      where: { uuid },
    },
    { transaction }
  );
};

const updateDishVariantAvailability = async (
  dish_uuid,
  is_available,
  transaction
) => {
  return await DishVariant.update(
    { is_available },
    { where: { dish_uuid }, transaction }
  );
};

const updateDishVariantAvailabilityByVariant = async (
  dish_variant_uuid,
  is_available,
  transaction
) => {
  return await DishVariant.update(
    { is_available },
    { where: { uuid: dish_variant_uuid }, transaction }
  );
};

const updateDishAvailability = async (uuid, is_available, transaction) => {
  return await Dish.update({ is_available }, { where: { uuid }, transaction });
};

// Delete a dish belonging to a specific restaurant
const removeDish = async (uuid, restaurant_uuid, transaction) => {
  return await Dish.destroy(
    {
      where: {
        uuid,
        restaurant_uuid,
      },
    },
    { transaction }
  );
};

// Delete all the variants of the specific dish
const removeDishVariants = async (uuid, transaction) => {
  return await DishVariant.destroy(
    {
      where: {
        dish_uuid: uuid,
      },
    },
    { transaction }
  );
};

// Delete a specific dish variant
const removeDishVariant = async (uuid, transaction) => {
  return await DishVariant.destroy(
    {
      where: {
        uuid,
      },
    },
    { transaction }
  );
};

const updateDishByDishUuid = async (uuid, dish, transaction) => {
  return await Dish.update(
    {
      category_uuid: dish.category_uuid,
      name: dish.name,
      price: dish.price,
      details: dish.details,
      is_veg: dish.is_veg,
      is_jain: dish.is_jain,
      image: dish.image,
    },

    { where: { uuid }, transaction, returning: true }
  );
};

const getDishImage = async (uuid, transaction) => {
  return await Dish.findOne(
    { where: { uuid }, attributes: ["image"] },
    { transaction }
  );
};

const findDishByUuid = async (uuid) => {
  return await Dish.findOne({
    where: { uuid },
  });
};

const getOwnerUuidFromDishUuid = async (dish_uuid) => {
  return await Restaurant.findAll({
    include: [
      {
        model: Dish,
        as: "dishes",
        where: {
          uuid: dish_uuid,
        },
        attributes: [],
      },
    ],
    attributes: ["owner_uuid"],
  });
};

export {
  addDish,
  addDishVariant,
  getRestaurantUuidByOwnerUuid,
  getCategory,
  getDishImage,
  getDishByDishUuid,
  getOwnerUuidFromDishUuid,
  getDishesByRestaurantUuidAndCategoryUuid,
  getDishVariants,
  updateDishAvailability,
  updateDishByDishUuid,
  updateInsertDishVariant,
  updateDishVariantAvailability,
  updateDishVariantAvailabilityByVariant,
  removeDish,
  removeDishVariants,
  removeDishVariant,
  findDishByUuid,
  checkDishBelongsToRestaurant,
};
