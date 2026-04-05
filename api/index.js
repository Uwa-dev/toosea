import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import connectDB from "./dbConnection.js";

dotenv.config();

const app = express();
connectDB();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})