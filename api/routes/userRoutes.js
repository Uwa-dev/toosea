import express from "express";
import { createUser, loginUser, deleteUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.delete("/:id", protect, deleteUser);

export default userRouter;