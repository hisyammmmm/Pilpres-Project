import express from "express";
import {
  createCandidate,
  getCandidates,
  updateCandidate,
  deleteCandidate,
} from "../controllers/CandidateController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { isAdmin } from "../middleware/IsAdmin.js";
import { uploadImage } from "../utils/UploadImage.js";

const router = express.Router();

router.get("/candidates", getCandidates);
router.post(
  "/candidates",
  verifyToken,
  isAdmin,
  uploadImage.single("image"),
  createCandidate
);
router.patch(
  "/candidates/:id",
  verifyToken,
  isAdmin,
  uploadImage.single("image"),
  updateCandidate
);
router.delete("/candidates/:id", verifyToken, isAdmin, deleteCandidate);

export default router;