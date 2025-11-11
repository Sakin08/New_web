import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateTokens } from "../services/tokenService.js";
import { validateEmail, validatePassword } from "../utils/validators.js";
import { uploadImage } from "../services/cloudinaryService.js";

export const register = async (req, res) => {
  const { name, email, department, password } = req.body;

  if (!name || !email || !department || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validateEmail(email))
    return res
      .status(400)
      .json({ message: "Only @student.sust.edu emails are allowed" });
  if (!validatePassword(password))
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    department,
    password: hashedPassword,
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role,
    accessToken,
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      accessToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

export const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(200).json(null); // No user → return null
  }
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  try {
    const { name, department } = req.body;
    const user = await User.findById(req.user._id);

    user.name = name || user.name;
    user.department = department || user.department;

    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const imageUrl = await uploadImage(req.file);

    const user = await User.findById(req.user._id);
    user.profilePicture = imageUrl;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Current password incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password changed" });
};
