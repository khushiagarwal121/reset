import {
  fetchAllCategories,
  fetchCategories,
  removeRestaurantCategory,
} from "./categoryService.js";
import { respondError, respondOk } from "../../utils/responseHandler.js";
import ApiError from "../../utils/apiError.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await fetchAllCategories();

    return respondOk(res, {
      message: "Categories Fetched Successfully!",
      data: categories,
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

const getCategories = async (req, res) => {
  try {
    const categories = await fetchCategories(req.user_uuid);

    return respondOk(res, {
      message: "Restaurant Categories Fetched Successfully!",
      data: categories,
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

const deleteRestaurantCategory = async (req, res) => {
  try {
    await removeRestaurantCategory(req.params.category_uuid, req.user_uuid);

    return respondOk(res, {
      message: "Category Deleted Successfully!",
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

export { getAllCategories, getCategories, deleteRestaurantCategory };
