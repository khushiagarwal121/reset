import databaseConfig from "../../models/index.js";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";

const { Restaurant, Category, Dish, Cuisine } = databaseConfig.db;

const getAllRestaurants = async (orderBy, offset, limit) => {
  return await Restaurant.findAll({
    order: orderBy,
    offset,
    limit,
  });
};

const getRestaurantByRestaurantUuid = async (uuid) => {
  return await Restaurant.findOne({
    where: {
      uuid,
    },
    include: [
      {
        model: Cuisine,
        attributes: ["uuid", "name"],
      },
    ],
  });
};

const getCategoryBySearchString = async (search_string) => {
  return await Category.findAll({
    where: {
      name: {
        [Op.iLike]: `%${search_string}%`,
      },
    },
    attributes: [
      "uuid",
      "name",
      [
        Sequelize.literal("'category'"),
        "belongs_to", // Alias for the static string
      ],
    ],
  });
};

const getRestaurantBySearchString = async (search_string) => {
  return await Restaurant.findAll({
    where: {
      name: {
        [Op.iLike]: `%${search_string}%`,
      },
    },
    attributes: [
      "uuid",
      "name",
      [
        Sequelize.literal("'restaurant'"),
        "belongs_to", // Alias for the static string
      ],
    ],
  });
};

const getRestaurantByCategoryUuid = async (
  category_uuid,
  is_pure_veg,
  orderBy,
  offset,
  limit
) => {
  const condition = {};
  if (is_pure_veg) condition.is_pure_veg = true;

  return await Restaurant.findAll({
    where: condition,
    include: [
      {
        model: Dish,
        as: "dishes",
        attributes: [], // Ensures only restaurants with matching dishes are included
        include: [
          {
            model: Category,
            as: "category",
            where: { uuid: category_uuid }, // Filter dishes by the specific category
            attributes: [], // Exclude category details from the response if not needed
          },
        ],
      },
    ],
    attributes: [
      "uuid",
      "name",
      "images",
      "avg_rating",
      "operating_hour",
      "temporarily_closed",
      "created_at",
      "updated_at",
    ],
    limit,
    offset,
    order: orderBy,
  });
};

export {
  getCategoryBySearchString,
  getRestaurantBySearchString,
  getRestaurantByCategoryUuid,
  getRestaurantByRestaurantUuid,
  getAllRestaurants,
};
