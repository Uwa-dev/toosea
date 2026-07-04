import express from "express";
import { createUser, loginUser, getAllUsers, getSingleUser, deleteUser } from "../controllers/userController.js";
import {protect, authorizeRoles} from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", protect, authorizeRoles("OWNER", "MANAGER"), createUser);
userRouter.post("/login", loginUser);
userRouter.get("/staffs", protect, authorizeRoles("OWNER", "MANAGER"), getAllUsers);
userRouter.get("/staff/:id", protect, authorizeRoles("OWNER", "MANAGER"), getSingleUser);
userRouter.delete("/:id", protect, deleteUser);

export default userRouter;