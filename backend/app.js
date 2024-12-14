import express from "express";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import cors from "cors";
import { respondError } from "./utils/responseHandler.js";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./features/auth/authApi.js";
import restaurantRouter from "./features/restaurants/restaurantApi.js";
import cuisineRouter from "./features/cuisines/cuisineApi.js";
import categoryRouter from "./features/categories/categoryApi.js";
import dishRouter from "./features/dishes/dishApi.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 1000,
  message:
    "We have received too many requests from your side. Please try again after 1 hour.",
});

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/categories", express.static(path.join(__dirname, "uploads")));
app.use(limiter);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/cuisines", cuisineRouter);
app.use("/api/v1/dishes", dishRouter);
app.use("/api/v1/categories", categoryRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.all("*", (req, res) => {
  respondError(res, {
    message: "The route you are trying to access does not exist.",
    statusCode: 404,
  });
});

export default app;
