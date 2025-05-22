import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import db from "./config/Database.js";

// Routes
import AuthRoute from "./routes/AuthRoute.js";
import CandidateRoute from "./routes/CandidateRoute.js";
import VoteRoute from "./routes/VoteRoute.js";

// Inisialisasi
dotenv.config();
const app = express();

// Middlewares
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // serve gambar kandidat

// Gunakan routes
app.use(AuthRoute);
app.use(CandidateRoute);
app.use(VoteRoute);

// Cek koneksi ke DB dan sync model
try {
  await db.authenticate();
  console.log("Database Connected...");
  await db.sync(); // sinkronisasi model dengan tabel
} catch (err) {
  console.error("Database connection failed:", err);
}

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
