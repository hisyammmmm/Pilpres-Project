import fs from "fs";
import path from "path";
import Candidate from "../models/CandidateModel.js";

export const getCandidates = async (req, res) => {
  try {
    const base = `${req.protocol}://${req.get("host")}/uploads`;
    const candidates = await Candidate.findAll();
    const data = candidates.map((c) => ({
      ...c.toJSON(),
      image: `${base}/${c.image}`,
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const createCandidate = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file?.filename ?? "default.png";
    const candidate = await Candidate.create({ name, description, image });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const candidate = await Candidate.findByPk(id);
    if (!candidate) return res.status(404).json({ msg: "Candidate tidak ditemukan" });

    // Jika ada upload baru, hapus file lama (kecuali default.png)
    let image = candidate.image;
    if (req.file) {
      if (image && image !== "default.png") {
        const oldPath = path.resolve("uploads", image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image = req.file.filename;
    }

    await Candidate.update({ name, description, image }, { where: { id } });
    res.json({ msg: "Candidate updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByPk(id);
    if (!candidate) return res.status(404).json({ msg: "Candidate tidak ditemukan" });

    // Hapus file gambar
    if (candidate.image && candidate.image !== "default.png") {
      const filePath = path.resolve("uploads", candidate.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Candidate.destroy({ where: { id } });
    res.json({ msg: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
