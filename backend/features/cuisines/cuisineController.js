import {
  fetchCuisines,
  fetchAllCuisines,
  modifyCuisines,
} from "./cuisineService.js";
import { respondError, respondOk } from "../../utils/responseHandler.js";
import ApiError from "../../utils/apiError.js";

const getAllCuisines = async (req, res) => {
  try {
    const cuisines = await fetchAllCuisines();

    return respondOk(res, {
      message: "Cuisines Fetched Successfully!",
      data: cuisines,
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

const getCuisines = async (req, res) => {
  try {
    const cuisines = await fetchCuisines(req.user_uuid);

    return respondOk(res, {
      message: "Restaurant Cuisines Fetched Successfully!",
      data: cuisines,
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

const updateCuisines = async (req, res) => {
  try {
    const added_cuisines = await modifyCuisines(
      req.body.cuisines,
      req.user_uuid
    );

    return respondOk(res, {
      message: "Cuisines Updated Successfully!",
      data: added_cuisines,
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

export { getCuisines, getAllCuisines, updateCuisines };
