import { Router } from "express";
import { uploadDishImage } from "../../middlewares/uploadMiddleware.js";
import { validateRequest } from "../../middlewares/validationMiddleware.js";
import { updateDishSchema, dishSchema } from "./dishSchema.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import {
  addDishes,
  getDishes,
  getDishVariants,
  updateDish,
  updateDishAvailability,
  updateDishVariantAvailability,
  removeDish,
  removeDishVariant,
} from "./dishController.js";

const router = Router();

router
  .route("/edit-dish/:dish_uuid")
  .put(
    validateRequest(updateDishSchema),
    authenticate,
    updateDish
  );

router
  .route("/")
  .post(uploadDishImage, validateRequest(dishSchema), authenticate, addDishes);

router.route("/:category_uuid").get(authenticate, getDishes); // Route to get all dishes, protected by authentication

router
  .route("/update-dish-availability")
  .patch(authenticate, updateDishAvailability);

router
  .route("/update-dish-variant-availability")
  .patch(authenticate, updateDishVariantAvailability);

// Route to get all variants of a specific dish, protected by authentication
router.route("/:dish_uuid/variants").get(getDishVariants);

// Route to delete a dish by its ID, protected by authentication
router.route("/:dish_uuid").delete(authenticate, removeDish);

// Route to delete a specific variant of a dish, protected by authentication
router
  .route("/:dish_uuid/remove-variant/:dish_variant_uuid")
  .delete(authenticate, removeDishVariant);

export default router;
