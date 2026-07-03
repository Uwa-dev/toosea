import express from "express";
import { createUser, loginUser, deleteUser } from "../controllers/userController.js";
import {protect, authorizeRoles} from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", protect, authorizeRoles("OWNER", "MANAGER"), createUser);
userRouter.post("/login", loginUser);
userRouter.delete("/:id", protect, deleteUser);

export default userRouter;