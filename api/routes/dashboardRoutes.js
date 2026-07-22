import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
} from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/adminDashboard",
  protect,
  authorizeRoles("OWNER", "MANAGER"),
  getDashboardStats
);

export default dashboardRouter