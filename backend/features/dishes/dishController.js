import {
  insertDishes,
  fetchDishes,
  fetchDishVariants,
  editDish,
  changeDishAvailability,
  changeDishVariantAvailability,
  deleteDish,
  deleteDishVariant,
} from "./dishService.js";
import { respondError, respondOk } from "../../utils/responseHandler.js";
import ApiError from "../../utils/apiError.js";

const addDishes = async (req, res) => {
  try {
    const added_dish = await insertDishes(
      req.body.dish,
      req.file,
      req.user_uuid
    );

    return respondOk(res, {
      message: "Dishes Added Successfully!",
      data: added_dish,
    });
  } catch (error) {
    console.log("An error from add dish api", error);
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

// Fetch all dishes and respond with data or an error
const getDishes = async (req, res) => {
  try {
    const fetched_dish = await fetchDishes(
      req.user_uuid,
      req.params.category_uuid
    );

    return respondOk(res, {
      message: "Dishes Fetched Successfully!",
      count: fetched_dish.length,
      data: fetched_dish,
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

// Fetch all variants of a specific dish and respond with data or an error
const getDishVariants = async (req, res) => {
  try {
    const fetched_dish_variants = await fetchDishVariants(req.params.dish_uuid);

    return respondOk(res, {
      message: "Dish Variants Fetched Successfully!",
      count: fetched_dish_variants.length,
      data: fetched_dish_variants,
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

// Delete a specific dish and respond with a success message or an error
const removeDish = async (req, res) => {
  try {
    await deleteDish(req.params.dish_uuid, req.user_uuid);

    return respondOk(res, {
      message: "Dish Deleted Successfully!",
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

// Delete a specific variant of a dish and respond with a success message or an error
const removeDishVariant = async (req, res) => {
  try {
    const deletedDishVariant = await deleteDishVariant(
      req.user_uuid,
      req.params.dish_uuid,
      req.params.dish_variant_uuid
    );

    return respondOk(res, {
      message: "Dish Variant Deleted Successfully!",
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

const updateDishAvailability = async (req, res) => {
  try {
    const dish = await changeDishAvailability(
      req.body.dish_uuid,
      req.body.is_available
    );

    return respondOk(res, {
      message: "Dish Availability Status Changed Successfully!",
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

const updateDishVariantAvailability = async (req, res) => {
  try {
    const dish = await changeDishVariantAvailability(
      req.body.dish_uuid,
      req.body.dish_variant_uuid,
      req.body.is_available,
      req.user_uuid
    );

    return respondOk(res, {
      message: "Dish Variant Availability Status Changed Successfully!",
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

const updateDish = async (req, res) => {
  try {
    const updated_dish = await editDish(
      req.params.dish_uuid,
      req.body.dish,
      req.user_uuid
    );
    if (!updated_dish) {
      throw new ApiError(
        "Internal Server Error: Something went wrong, Please try again later",
        500
      );
    }
    return respondOk(res, {
      message: "Dish Updated Successfully",
      data: updated_dish,
    });
  } catch (error) {
    console.log("An error from edit dish api", error);
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
  addDishes,
  getDishes,
  getDishVariants,
  updateDish,
  updateDishAvailability,
  updateDishVariantAvailability,
  removeDish,
  removeDishVariant,
};
