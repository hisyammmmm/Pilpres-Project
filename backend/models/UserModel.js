import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define("users", {
    nik: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: "user" },
    refresh_token: { type: DataTypes.TEXT }
}, {
    freezeTableName: true
});

export default User;