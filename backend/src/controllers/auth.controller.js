import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields (username, email, password) are required");
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const user = await User.create({ username, email, password });
  if (!user) throw new ApiError(500, "Something went wrong while creating the user");

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
      "User registered successfully"
    )
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      },
      "Logged in successfully"
    )
  );
});
