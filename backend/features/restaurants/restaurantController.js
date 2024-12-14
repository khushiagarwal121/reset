import {
  fetchRestaurant,
  fetchAllRestaurants,
  getRestaurants,
  getCategoryAndRestaurant,
} from "./restaurantService.js";
import ApiError from "../../utils/apiError.js";
import { respondError, respondOk } from "../../utils/responseHandler.js";

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await fetchAllRestaurants(req);

    return respondOk(res, {
      message: "All Restaurants Fetched Successfully!",
      data: restaurants,
    });
  } catch (error) {
    console.log(error);

    // Handle unexpected errors with a default 500 error response
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");

    return respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const restaurant = await fetchRestaurant(req.params.restaurant_uuid);

    return respondOk(res, {
      message: "Restaurant Fetched Successfully!",
      data: restaurant,
    });
  } catch (error) {
    console.log(error);

    // Handle unexpected errors with a default 500 error response
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");

    return respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const fetchCategoryAndRestaurant = async (req, res) => {
  const search_string = req.query.search_string;
  try {
    const response = await getCategoryAndRestaurant(search_string);

    return respondOk(res, { response });
  } catch (error) {
    console.log(error);
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");

    return respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

const fetchRestaurants = async (req, res) => {
  try {
    const category_uuid = req.params.category_uuid;
    const is_pure_veg = req.query.is_pure_veg
      ? req.query.is_pure_veg === "true"
      : false;
    const limit = req.query.limit || 2;
    const page = req.query.page;
    const sort = req.query.sort;
    const restaurants = await getRestaurants(
      category_uuid,
      is_pure_veg,
      limit,
      page,
      sort
    );
    return respondOk(res, {
      status: "success",
      data: restaurants,
    });
  } catch (error) {
    console.log(error);
    !(error instanceof ApiError) &&
      (error.statusCode = 500) &&
      (error.message =
        "Internal Server Error: Something went wrong, Please try again later");

    return respondError(res, {
      message: error.message,
      statusCode: error.statusCode,
    });
  }
};

export {
  fetchRestaurants,
  fetchCategoryAndRestaurant,
  getRestaurant,
  getAllRestaurants,
};
