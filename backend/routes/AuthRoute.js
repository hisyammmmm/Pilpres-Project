import express from "express";
import { register, login, logout } from "../controllers/AuthController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);

export default router;