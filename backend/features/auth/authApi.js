import { Router } from "express";
import {
  googleAuth,
  googleAuthCallback,
  googleAuthSuccess,
  signup,
  checkUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userProfile,
  validateResetToken,
} from "./authController.js";
import passport from "../../utils/passport.js";
import {
  loginWithGoogleSchema,
  signupSchema,
  checkUserExistenceSchema,
  loginSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./authSchema.js";
import { validateRequest } from "../../middlewares/validationMiddleware.js";
import { authenticate } from "../../middlewares/authMiddleware.js";
import { uploadFiles } from "../../middlewares/uploadMiddleware.js";

const router = Router();

router.use(passport.initialize());

router
  .route("/google")
  .post(validateRequest(loginWithGoogleSchema), googleAuth);
router.route("/google/callback").get(googleAuthCallback, googleAuthSuccess);
router
  .route("/register")
  .post(uploadFiles, validateRequest(signupSchema), signup);
router
  .route("/checkUser")
  .post(validateRequest(checkUserExistenceSchema), checkUser);

router.route("/login").post(validateRequest(loginSchema), login);
router
  .route("/logout")
  .post(validateRequest(logoutSchema), authenticate, logout);

router
  .route("/forgot-password")
  .post(validateRequest(forgotPasswordSchema), forgotPassword);

router
  .route("/reset-password/:token")
  .post(validateRequest(resetPasswordSchema), resetPassword);

router.route("/user/profile").get(authenticate, userProfile);
router.route("/validate-reset-token/:token").get(validateResetToken);

export default router;
