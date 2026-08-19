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


//Name: Miracle Imade
//Email: miracle@gmail.com
// Role: Manager
//Password: dIxdG2L4q9

// Name: Chidi Dalu
// Email: chidi@gmail.com
//Role: RECEPTIONIST
// Staff Code: REC003
//Password: FI6ai4pgkr