import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware.js";
import {
  updateCuisines,
  getCuisines,
  getAllCuisines,
} from "./cuisineController.js";

const router = Router();

router.route("/restaurant").get(authenticate, getCuisines);

router
  .route("/")
  .patch(authenticate, updateCuisines)
  .get(authenticate, getAllCuisines);

export default router;
