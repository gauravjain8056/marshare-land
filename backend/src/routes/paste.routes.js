import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { protect, optionalProtect } from "../middlewares/auth.middleware.js";
import {
  createPaste,
  getPaste,
  getUserPastes,
  deletePaste,
} from "../controllers/paste.controller.js";

const router = Router();

router.post("/create", optionalProtect, upload.single("file"), createPaste);

router.get("/my-pastes", protect, getUserPastes);

router.get("/:id", getPaste);

router.delete("/:id", protect, deletePaste);

export default router;
