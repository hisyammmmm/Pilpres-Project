import express from "express";
import { voteCandidate, getVotes } from "../controllers/VoteController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Endpoint untuk melakukan vote (hanya user yang sudah login)
router.post("/vote", verifyToken, voteCandidate);

// Endpoint untuk mendapatkan semua vote (hanya admin boleh akses — jika kamu mau bisa tambahkan middleware isAdmin di sini)
router.get("/votes", verifyToken, getVotes);

export default router;
