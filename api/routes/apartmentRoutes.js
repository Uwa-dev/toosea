import express from "express";

import {
  createApartment,
  getAllApartments,
  getApartmentById,
  updateApartment,
  deleteApartment, 
  uploadApartmentImages,
  deleteApartmentImage,
} from "../controllers/apartmentController.js";

import upload from "../middleware/upload.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const apartmentRouter = express.Router();

apartmentRouter.get("/", getAllApartments);
apartmentRouter.get("/:id", getApartmentById);
apartmentRouter.post("/", protect, authorizeRoles("OWNER"), createApartment);
apartmentRouter.post("/:id/images", protect, authorizeRoles("OWNER"), upload.array("images", 15), uploadApartmentImages);
apartmentRouter.delete("/:id/images/:publicId", protect, authorizeRoles("OWNER"), deleteApartmentImage);
apartmentRouter.patch("/:id", protect, authorizeRoles("OWNER"), updateApartment);
apartmentRouter.delete("/:id", protect, authorizeRoles("OWNER"), deleteApartment);

export default apartmentRouter;
