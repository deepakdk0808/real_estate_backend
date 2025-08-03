import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  suggestProperties
} from "../controllers/propertyControllers.js";
import { authenticate, authorizeRoles } from "../middlewares/middlewares.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const suggestRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per `window`
  message: {
    success: false,
    message: "Too many requests. Please try again after a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", authenticate, authorizeRoles("Admin"), createProperty);
router.put("/:id", authenticate, authorizeRoles("Admin"), updateProperty);
router.delete("/:id", authenticate, authorizeRoles("Admin"), deleteProperty);
router.get("/", authenticate, getAllProperties);
router.get("/suggest", authenticate, suggestRateLimiter, suggestProperties);
router.get("/:id", authenticate, getPropertyById);

export default router;
