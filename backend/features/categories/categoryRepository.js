import { Sequelize } from "sequelize";
import databaseConfig from "../../models/index.js";

const { Category, Dish, DishVariant } = databaseConfig.db;

const getAllCategories = async () => {
  return await Category.findAll({
    attributes: ["uuid", "name", "image"],
  });
};

const getCategories = async (restaurant_uuid) => {
  const dishes = await Dish.findAll({
    where: { restaurant_uuid },
    attributes: ["category_uuid"],
  });

  const category_uuids = dishes.map((dish) => dish.category_uuid);

  return await Category.findAll({
    where: {
      uuid: {
        [Sequelize.Op.in]: category_uuids,
      },
    },
  });
};

const deleteDishVariants = async (dishUuids, transaction) => {
  await DishVariant.destroy({
    where: {
      dish_uuid: {
        [Sequelize.Op.in]: dishUuids,
      },
    },
    transaction,
  });
};

const deleteDish = async (category_uuid, restaurant_uuid, transaction) => {
  await Dish.destroy({
    where: {
      category_uuid,
      restaurant_uuid,
    },
    transaction,
  });
};

const getDishesByRestaurantUuidAndCategoryUuid = async (
  restaurant_uuid,
  category_uuid
) => {
  return await Dish.findAll({
    where: {
      restaurant_uuid,
      category_uuid,
    },
  });
};

export {
  getAllCategories,
  getCategories,
  getDishesByRestaurantUuidAndCategoryUuid,
  deleteDishVariants,
  deleteDish,
};
