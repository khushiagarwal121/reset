import { respondError } from "../utils/responseHandler.js";
import ApiError from "../utils/apiError.js";
import upload from "./multerConfig.js";
import multer from "multer";

const uploadFiles = (req, res, next) => {
  upload.fields([
    { name: "fssai_certificate", maxCount: 1 },
    { name: "gst_certificate", maxCount: 1 },
    { name: "images", maxCount: 1 },
    { name: "profile_image", maxCount: 1 },
    { name: "license", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError || err instanceof ApiError) {
        return respondError(res, {
          message: err.message,
          statusCode: 400,
        });
      } else {
        return respondError(res, {
          message: "An error occurred during file upload.",
          statusCode: 500,
        });
      }
    }
    next();
  });
};

const uploadDishImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      // Handle Multer error
      console.log(err);

      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      // Handle custom errors (e.g., file type validation)
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      // Handle any other errors
      return res.status(500).json({ error: "An unexpected error occurred." });
    }

    // req.body.dish = JSON.parse(req.body.dish);

    next();
  });
};

export { uploadFiles, uploadDishImage };
