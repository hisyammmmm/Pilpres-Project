import Vote from "../models/VoteModel.js";
import Candidate from "../models/CandidateModel.js";
import User from "../models/UserModel.js";

export const voteCandidate = async (req, res) => {
  try {
    const userId = req.userId;
    const { candidateId } = req.body;

    const existing = await Vote.findOne({ where: { userId } });
    if (existing) return res.status(403).json({ msg: "User already voted" });

    const vote = await Vote.create({ userId, candidateId });
    res.status(201).json(vote);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getVotes = async (_req, res) => {
  try {
    const votes = await Vote.findAll({
      include: [
        { model: Candidate, as: "candidate", attributes: ["id", "name", "image"] },
        { model: User, attributes: ["id", "name"] },
      ],
    });
    res.json(votes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
