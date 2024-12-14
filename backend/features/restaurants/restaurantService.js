import {
  getAllRestaurants,
  getRestaurantByRestaurantUuid,
  getCategoryBySearchString,
  getRestaurantBySearchString,
  getRestaurantByCategoryUuid,
} from "./restaurantRepository.js";
import ApiError from "../../utils/apiError.js";
import { sort, paginate } from "../../utils/apiFeatures.js";

const fetchAllRestaurants = async (req) => {
  const limit = req.query.limit || 5; // Default limit for pagination

  return await getAllRestaurants(
    sort(req.query.sort),
    paginate(req.query.page, limit),
    limit
  );
};

const fetchRestaurant = async (restaurant_uuid) => {
  const restaurant = await getRestaurantByRestaurantUuid(restaurant_uuid);

  if (!restaurant) {
    throw new ApiError(
      `There is no restaurant found belonging to ${restaurant_uuid} restaurant_uuid !!`,
      404
    );
  }
  return restaurant;
};

const getCategoryAndRestaurant = async (search_string) => {
  try {
    const categories = await getCategoryBySearchString(search_string);
    const restaurants = await getRestaurantBySearchString(search_string);
    return [...categories, ...restaurants];
  } catch (error) {
    throw error;
  }
};

const getRestaurants = async (
  category_uuid,
  is_pure_veg,
  limit,
  page,
  sort_field
) => {
  try {
    const restaurants = await getRestaurantByCategoryUuid(
      category_uuid,
      is_pure_veg,
      sort(sort_field),
      paginate(page, limit),
      limit
    );
    return restaurants;
  } catch (error) {
    throw error;
  }
};

export {
  getCategoryAndRestaurant,
  getRestaurants,
  fetchRestaurant,
  fetchAllRestaurants,
};
