import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware.js";
import {
  getRestaurant,
  getAllRestaurants,
  fetchRestaurants,
  fetchCategoryAndRestaurant,
} from "./restaurantController.js";

const router = Router();

router.route("/").get(getAllRestaurants);
router.route("/:restaurant_uuid").get(authenticate, getRestaurant);
router.route("/search/get-suggestions").get(fetchCategoryAndRestaurant);
router.route("/search/get-restaurants/:category_uuid").get(fetchRestaurants);

export default router;
