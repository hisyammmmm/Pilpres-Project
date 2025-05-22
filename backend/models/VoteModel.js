import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import Candidate from "./CandidateModel.js";

const { DataTypes } = Sequelize;

const Vote = db.define(
  "votes",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // user hanya boleh vote sekali
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

// --------- Relasi ----------
User.hasOne(Vote, { foreignKey: "userId" });
Vote.belongsTo(User, { foreignKey: "userId" });

Candidate.hasMany(Vote, { foreignKey: "candidateId" });
Vote.belongsTo(Candidate, { foreignKey: "candidateId" });

export default Vote;
