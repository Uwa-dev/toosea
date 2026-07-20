import dotenv from "dotenv";
dotenv.config({
  path: "../.env"
});

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";



const seedOwner = async () => {
  try {
    await mongoose.connect(process.env.DB);

    const existingOwner = await User.findOne({
      role: "OWNER"
    });

    if (existingOwner) {
      console.log("Owner already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "owner123",
      10
    );

    const owner = await User.create({
      fullName: "System Owner",
      email: "owner@system.com",
      password: hashedPassword,
      role: "OWNER",
      staffCode: "OWN001"
    });

    console.log("Owner created:", owner);

    process.exit();

  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

seedOwner();


// Name: Mensah Tony
// Email: tony@gmail.com
// Role: MANAGER
// Staff Code: MGR001
// Password: Oq8qwTJEYb

// Name: Donald Muc
// Email: donald@gmail.com
// Role: RECEPTIONIST
// Staff Code: REC001
// Password: dUT5utpJFA

// Name: Chizaram Madu
// Email: chizaram@gmail.com
// Role: RECEPTIONIST
// Staff Code: REC002
// Password: 8I4k8#FCdh