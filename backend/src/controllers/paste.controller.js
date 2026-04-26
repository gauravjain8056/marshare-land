import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Paste from "../models/paste.model.js";

const getExpiryTime = (expiresIn) => {
  const now = new Date();
  switch (expiresIn) {
    case "10m": return new Date(now.getTime() + 10 * 60 * 1000);
    case "30m": return new Date(now.getTime() + 30 * 60 * 1000);
    case "1h":  return new Date(now.getTime() + 60 * 60 * 1000);
    case "3h":  return new Date(now.getTime() + 3 * 60 * 60 * 1000);
    default:    return new Date(now.getTime() + 10 * 60 * 1000);
  }
};

export const createPaste = asyncHandler(async (req, res) => {
  const { type, content, expiresIn, password } = req.body;

  const pasteId = nanoid(8);
  const expiresAt = getExpiryTime(expiresIn);

  let finalContent = content;
  let isFile = false;

  if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryResponse) {
      throw new ApiError(500, "File upload to Cloudinary failed");
    }
    finalContent = cloudinaryResponse.secure_url;
    isFile = true;
  }

  if (!finalContent) {
    throw new ApiError(400, "Content or a file is required");
  }

  let hashedPassword = null;
  let isProtected = false;
  if (password && password.trim() !== "") {
    hashedPassword = await bcrypt.hash(password, 10);
    isProtected = true;
  }

  await Paste.create({
    pasteId,
    type,
    content: finalContent,
    isFile,
    expiresAt,
    isProtected,
    password: hashedPassword,
    userId: req.user?._id ?? null,
  });

  return res.status(201).json(
    new ApiResponse(201, { pasteId, url: finalContent }, "Paste created successfully 🚀")
  );
});

export const getPaste = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.query;

  const paste = await Paste.findOne({ pasteId: id });

  if (!paste) throw new ApiError(404, "Paste not found");

  if (new Date() > paste.expiresAt) {
    await Paste.deleteOne({ pasteId: id });
    throw new ApiError(410, "Paste has expired");
  }

  if (paste.isProtected) {
    if (!password) throw new ApiError(401, "Password required");
    const match = await bcrypt.compare(password, paste.password);
    if (!match) throw new ApiError(403, "Incorrect password");
  }

  const { password: _, ...safePaste } = paste.toObject();

  return res.status(200).json(
    new ApiResponse(200, safePaste, "Paste fetched successfully")
  );
});

export const getUserPastes = asyncHandler(async (req, res) => {
  const pastes = await Paste.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(200, pastes, "Pastes fetched successfully")
  );
});

export const deletePaste = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const paste = await Paste.findOne({ pasteId: id });

  if (!paste) throw new ApiError(404, "Paste not found");

  if (!paste.userId || paste.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this paste");
  }

  await Paste.deleteOne({ pasteId: id });
  return res.status(200).json(
    new ApiResponse(200, null, "Paste removed")
  );
});
