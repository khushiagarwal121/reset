import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware.js";
import {
  getAllCategories,
  getCategories,
  deleteRestaurantCategory,
} from "./categoryController.js";

const router = Router();

router.route("/").get(getAllCategories);
router.route("/restaurant").get(authenticate, getCategories);
router.route("/:category_uuid").delete(authenticate, deleteRestaurantCategory);

export default router;
