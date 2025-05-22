import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Candidate = db.define(
  "candidates",
  {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING, // will store filename only
  },
  {
    freezeTableName: true,
  }
);

export default Candidate;