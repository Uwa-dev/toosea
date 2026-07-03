import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { generateStaffCode } from "../utils/generateStaffCode.js";

const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";

  let password = "";

  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};


export const createUser = async (req, res) => {

  try {
    const creator = req.user; // logged-in user

    const { fullName, email, role } = req.body;

    // prevent self role escalation
    if (role === "OWNER") {
      return res.status(403).json({
        message: "Owner cannot be created manually"
      });
    }

    // ROLE RULES
    if (creator.role === "MANAGER" && role === "MANAGER") {
      return res.status(403).json({
        message: "Manager cannot create another manager"
      });
    }

    if (
      creator.role === "MANAGER" &&
      role === "OWNER"
    ) {
      return res.status(403).json({
        message: "Manager cannot create owner"
      });
    }

    if (
      creator.role === "RECEPTIONIST"
    ) {
      return res.status(403).json({
        message: "Receptionist cannot create users"
      });
    }

    // check duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const staffCode = await generateStaffCode(role);

    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role,
        staffCode
    });

    res.status(201).json({
        message: "User created successfully",
        user: {
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            staffCode: user.staffCode,
            password: plainPassword
        }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        staffCode: user.staffCode
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        staffCode: user.staffCode
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const requester = req.user;
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ OWNER cannot be deleted
    if (user.role === "OWNER") {
      return res.status(403).json({
        message: "Owner account cannot be deleted"
      });
    }

    // ❌ Receptionist cannot delete anyone
    if (requester.role === "RECEPTIONIST") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    // MANAGER can only delete receptionist
    if (
      requester.role === "MANAGER" &&
      user.role !== "RECEPTIONIST"
    ) {
      return res.status(403).json({
        message: "Manager can only delete receptionists"
      });
    }

    // OWNER can delete manager + receptionist
    if (
      requester.role === "OWNER"
    ) {
      await User.findByIdAndDelete(userId);
      return res.json({ message: "User deleted successfully" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};